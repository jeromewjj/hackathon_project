package database

import (
	_ "errors"
	"time"
)

// TYPE DECLARATION
type TransactionType string

const (
	BUY  TransactionType = "BUY"
	SELL TransactionType = "SELL"
)

type Transaction struct {
	TransactionId     int `gorm:"primarykey" json:"transaction_id"`
	InstrumentId      int `gorm:"foreignkey"`
	Quantity          int
	TransactionDate   time.Time
	TransactionAmount float64
	TransactionType   TransactionType // enum
	// TransactionCurrency string // not necessary
	IsCancelled bool
	CreatedAt   time.Time
	ModifiedAt  time.Time `json:"modified_at"`
	DeletedAt   time.Time `json:"deleted_at"`
}

func (db *Database) GetTransactionsByInstrumentId(instrumentId int) ([]*Transaction, error) {
	transactions := make([]*Transaction, 0)
	result := db.gormDB.Where("instrument_id = ? AND is_cancelled = ?", instrumentId, false).Find(&transactions)
	return transactions, result.Error
}

func (db *Database) GetTransactionsByInstrumentIdAfterDate(instrumentId int, datetime time.Time) ([]*Transaction, error) {
	transactions := make([]*Transaction, 0)
	// also filter out isCancelled == true transactions as those are soft deletes
	result := db.gormDB.Where("instrument_id = ? AND transaction_date > ? AND is_cancelled = ?", instrumentId, datetime, false).Find(&transactions)
	return transactions, result.Error
}
