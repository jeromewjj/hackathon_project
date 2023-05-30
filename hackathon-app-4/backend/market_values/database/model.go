package database

import (
	_ "errors"
	"fmt"
	"gorm.io/gorm"
	"time"
)

// DATABASE OBJECTS
type Database struct {
	gormDB *gorm.DB
}

var DB *Database

type MarketValue struct {
	Id              int       `gorm:"primaryKey;autoIncrement"`
	InstrumentId    int       `json:"instrument_id"`
	MarketValue     float64   `json:"market_value"`
	MarketValueDate time.Time `json:"market_value_date"`
	CreatedAt       time.Time `json:"created_at"`
	ModifiedAt      time.Time `json:"modified_at"`
}

func InitializeDatabase() *Database {
	gormDB := Connect(dBConfig)
	return &Database{
		gormDB: gormDB,
	}
}

type MarketValueParam struct {
	MarketValue     float64 `json:"market_value"`
	MarketValueDate string  `json:"market_value_date"`
}

func (db *Database) AddMarketValue(instrumentId int, marketValueParam *MarketValueParam) error {
	fmt.Printf("Received create req for : %v:%v\n", instrumentId, marketValueParam)

	marketValueDate, _ := time.Parse("2006-01-02", marketValueParam.MarketValueDate)

	marketValue := MarketValue{
		InstrumentId:    instrumentId,
		MarketValue:     marketValueParam.MarketValue,
		MarketValueDate: marketValueDate,
		CreatedAt:       time.Now(),
		ModifiedAt:      time.Now(),
	}

	result := db.gormDB.Create(&marketValue)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (db *Database) GetMarketValuesForSpecificInstrumentID(instrumentId int) ([]*MarketValue, error) {
	marketValues := make([]*MarketValue, 0)
	result := db.gormDB.Where("instrument_id = ?", instrumentId).Find(&marketValues)
	return marketValues, result.Error
}

func (db *Database) GetLatestMarketValueForSpecificInstrumentIDBeforeDate(instrumentId int, date time.Time) (*MarketValue, error) {
	marketValue := &MarketValue{}
	result := db.gormDB.Where("instrument_id = ? and market_value_date <= date", instrumentId, date).Last(&marketValue)
	return marketValue, result.Error
}

func (db *Database) GetAllMarketValues() ([]*MarketValue, error) {
	fmt.Println("Checkpoint : received get all req")
	MarketValues := make([]*MarketValue, 0)
	result := db.gormDB.Find(&MarketValues)

	return MarketValues, result.Error
}

func (db *Database) SaveMarketValue(instrumentId int, marketValueParams []*MarketValueParam) {

	for _, marketValueParam := range marketValueParams {

		marketValueEntry := &MarketValue{}
		result := db.gormDB.Where("instrument_id = ? and market_value_date = ?",
			instrumentId, marketValueEntry.MarketValueDate).Find(&marketValueEntry)

		if result.Error != nil {
			fmt.Printf("error at saveMarketValue: %v\n", result.Error)
		}

		if marketValueEntry.Id == 0 {
			db.AddMarketValue(instrumentId, marketValueParam)
		} else {
			db.gormDB.Model(marketValueEntry).Updates(map[string]interface{}{
				"market_value":      marketValueParam.MarketValue,
				"market_value_date": marketValueParam.MarketValueDate,
				"modified_at":       time.Now(),
			})
		}
	}

}
