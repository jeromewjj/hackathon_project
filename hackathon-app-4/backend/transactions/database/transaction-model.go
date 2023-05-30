package database

import (
	_ "errors"
	"fmt"
	"time"
)

// TYPE DECLARATION
type TransactionType string

const (
	BUY  TransactionType = "BUY"
	SELL TransactionType = "SELL"
)

type Transaction struct {
	TransactionId     int             `gorm:"primarykey" json:"transaction_id"`
	InstrumentId      int             `json:"instrument_id"`
	Instrument        Instrument      `gorm:"foreignKey:InstrumentId;references:InstrumentId" json:"instrument"`
	Quantity          int             `json:"quantity"`
	TransactionDate   time.Time       `json:"transaction_date"`
	TransactionAmount float64         `json:"transaction_amount"`
	TransactionType   TransactionType `json:"transaction_type"`
	IsCancelled       bool            `json:"is_cancelled"`
	CreatedAt         time.Time       `json:"created_at"`
	ModifiedAt        time.Time       `json:"modified_at"`
}

func (db *Database) AddTransaction(transaction *Transaction) error {
	fmt.Printf("Received create req for : %v\n", transaction)
	result := db.gormDB.Create(&transaction)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (db *Database) GetTransaction(id int) (*Transaction, error) {
	transaction := &Transaction{}
	result := db.gormDB.Model(transaction).
		Joins("left join instruments on instruments.instrument_id = transactions.instrument_id").
		Where("transaction_id = ? AND is_cancelled = ?", id, false).
		Find(transaction)
	// db.Model(&Transaction{}).First("users.name, emails.email").Joins("left join emails on emails.user_id = users.id").Scan(&result{})
	fmt.Println(transaction)
	return transaction, result.Error
}

func (db *Database) GetAllTransactions() ([]*Transaction, error) {
	fmt.Println("Checkpoint : received get all req")

	transactions := make([]*Transaction, 0)
	result := db.gormDB.Model(transactions).
		Joins("left join instruments on transactions.instrument_id = instruments.instrument_id").
		Where("is_cancelled = ?", false).
		Find(&transactions)
	fmt.Println(transactions)
	return transactions, result.Error
}

func (db *Database) GetAllTransactionsWithTimePeriod(startDate, endDate time.Time) ([]*Transaction, error) {
	fmt.Println("Checkpoint : received get all req")

	transactions := make([]*Transaction, 0)
	result := db.gormDB.Model(transactions).
		Joins("left join instruments on transactions.instrument_id = instruments.instrument_id").
		Where("transaction_date >= ? AND transaction_date <= ? AND is_cancelled = ?", startDate, endDate, false).
		Find(&transactions)
	fmt.Println(transactions)
	return transactions, result.Error
}

func (db *Database) DeleteTransaction(transactionId int) error {
	// TODO: error handling -- if is_cancelled is already true, user cannot delete it again
	result := db.gormDB.Model(&Transaction{}).Where("transaction_id = ?", transactionId).Update("is_cancelled", true)
	return result.Error
}
