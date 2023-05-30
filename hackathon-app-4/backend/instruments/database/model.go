package database

import (
	"errors"
	_ "errors"
	"fmt"
	"time"

	"gorm.io/gorm"
)

// TYPE DECLARATION
type InstrumentType string

const (
	REAL_ESTATE    InstrumentType = "REAL_ESTATE"
	PRIVATE_EQUITY InstrumentType = "PRIVATE_EQUITY"
)

type Instrument struct {
	InstrumentId       int            `gorm:"primarykey;autoIncrement" json:"instrument_id"`
	InstrumentName     string         `json:"instrument_name"`
	InstrumentType     InstrumentType `json:"instrument_type"`
	Country            string         `json:"country"`
	Sector             string         `json:"sector"`
	InstrumentCurrency string         `json:"instrument_currency"`
	IsTradeable        bool           `json:"is_tradeable"`
	Notes              string         `json:"notes"`
	CreatedAt          time.Time      `json:"created_at"`
	ModifiedAt         time.Time      `json:"modified_at"`
	DeletedAt          gorm.DeletedAt `gorm:"index"`
}

func InitializeDatabase() *Database {
	gormDB := Connect(dBConfig)
	return &Database{
		gormDB: gormDB,
	}
}

func (db *Database) AddInstrument(instrument *Instrument) error {
	fmt.Printf("Received create req for : %v\n", instrument)
	result := db.gormDB.Create(&instrument)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (db *Database) GetInstrument(id int) (*Instrument, error) {
	instr := &Instrument{}
	result := db.gormDB.First(instr, id)
	fmt.Println(instr)
	return instr, result.Error
}

func (db *Database) GetAllInstruments() ([]*Instrument, error) {

	fmt.Println("Checkpoint : received get all req")

	instruments := make([]*Instrument, 0)
	result := db.gormDB.Find(&instruments)

	return instruments, result.Error
}

func (db *Database) SaveInstrument(instrument *Instrument) error {

	if instrument == nil {
		return errors.New("(error) saveInstruments : instrument is nil")
	}

	db.gormDB.Model(instrument).Updates(map[string]interface{}{
		"instrument_name":     instrument.InstrumentName,
		"country":             instrument.Country,
		"sector":              instrument.Sector,
		"instrument_type":     instrument.InstrumentType,
		"instrument_currency": instrument.InstrumentCurrency,
		"is_tradeable":        instrument.IsTradeable,
		"notes":               instrument.Notes,
		"modified_at":         time.Now(),
	})

	return nil
}

func (db *Database) DeleteInstrument(instrumentId int) {
	instrument := &Instrument{InstrumentId: instrumentId}
	db.gormDB.Delete(&instrument)
}
