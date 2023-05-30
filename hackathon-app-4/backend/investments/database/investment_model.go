package database

import (
	"errors"
	_ "errors"
	"fmt"
	"time"
)

type Investment struct {
	InstrumentId                int       `gorm:"primarykey" json:"instrument_id"`
	CumulativeQuantity          int       `json:"cumulative_quantity"`
	CumulativeTransactionAmount float64   `json:"cumulative_transaction_amount"`
	RefreshDatetime             time.Time `gorm:"autoUpdateTime;primarykey" json:"refresh_datetime"`
	// CreatedAt                   time.Time `json:"created_at"`
}

func (db *Database) GetInvestmentsByInstrumentId(instrumentId int) ([]*Investment, error) {
	investments := make([]*Investment, 0)
	result := db.gormDB.Where("instrument_id = ?", instrumentId).Find(&investments)
	return investments, result.Error
}

func (db *Database) GetInvestmentsByInstrumentIdWithinPeriod(startDate time.Time, endDate time.Time) ([]*Investment, error) {
	investments := make([]*Investment, 0)
	result := db.gormDB.Where("refresh_datetime >= ? and refresh_datetime <= ?", startDate, endDate).Find(&investments)
	return investments, result.Error
}

func (db *Database) GetLatestInvestmentByInstrumentId(instrumentId int) (*Investment, error) {
	investment := &Investment{}
	result := db.gormDB.Where("instrument_id = ?", instrumentId).Last(&investment)
	return investment, result.Error
}

func (db *Database) GetLatestInvestmentByInstrumentIdBeforeSetDate(instrumentId int, beforeDate time.Time) (*Investment, error) {
	investment := &Investment{}
	result := db.gormDB.Where("instrument_id = ? and refresh_datetime <= ?", instrumentId, beforeDate).Last(&investment)
	return investment, result.Error
}

func (db *Database) UpdateInvestment(ori_inv, new_inv *Investment) error {
	// if investment == nil {
	// 	return errors.New("(error) saveInvestments : investment is nil")
	// }

	// inv_copy := &Investment{
	// 	InstrumentId:                investment.InstrumentId,
	// 	CumulativeQuantity:          investment.CumulativeQuantity,
	// 	CumulativeTransactionAmount: investment.CumulativeTransactionAmount,
	// 	RefreshDatetime:             investment.RefreshDatetime,
	// }
	db.gormDB.Model(ori_inv).Updates(map[string]interface{}{
		"instrument_id":                 new_inv.InstrumentId,
		"cumulative_quantity":           new_inv.CumulativeQuantity,
		"cumulative_transaction_amount": new_inv.CumulativeTransactionAmount,
		"refresh_datetime":              new_inv.RefreshDatetime,
	})
	fmt.Printf("Updated inv for : %v\n", ori_inv)

	return nil
}

func (db *Database) AddInvestment(investment *Investment) error {
	fmt.Printf("Received create req for : %v\n", investment)
	result := db.gormDB.Create(&investment)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (db *Database) UpsertInvestment(investment *Investment) error {
	fmt.Println("upserting:", investment)
	// upsert needs to update rows where the refresh datetime is the same MONTH and not exactly the same
	investments := make([]*Investment, 0)
	result := db.gormDB.Where("instrument_id = ? AND YEAR(refresh_datetime) = ? AND MONTH(refresh_datetime) = ?",
		investment.InstrumentId, investment.RefreshDatetime.Year(), investment.RefreshDatetime.Month()).
		Find(&investments)
	if result.Error != nil {
		return result.Error
	}

	// cols := []clause.Column{
	// 	{Name: "instrument_id"},
	// 	{Name: "refresh_datetime"},
	// }

	// result := db.gormDB.Clauses(clause.OnConflict{
	// 	Columns:   cols, // primary key columns
	// 	UpdateAll: true, // update all
	// }).Create(&investment)
	if len(investments) > 1 {
		return errors.New(fmt.Sprintf("More than 1 record of an investment in a month:", investments))
	}
	if len(investments) == 1 {
		return db.UpdateInvestment(investments[0], investment)
	} else {
		return db.AddInvestment(investment)
	}
}
