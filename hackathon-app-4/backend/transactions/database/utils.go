package database

import (
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type DatabaseConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	Database string
}

var (
	mockDBConfig = &DatabaseConfig{
		Host:     "gic-team04.csm9hvdexio6.ap-southeast-1.rds.amazonaws.com",
		Port:     3306,
		Username: "admin",
		Password: "password",

		//Host:     "localhost",
		//Port:     3306,
		//Username: "root",
		//Password: "root",
		Database: "gic04",
	}
)

// DATABASE OBJECTS
type Database struct {
	gormDB *gorm.DB
}

var DB *Database

func InitializeDatabase() *Database {
	gormDB := Connect(mockDBConfig)
	return &Database{
		gormDB: gormDB,
	}
}

func Connect(config *DatabaseConfig) *gorm.DB {
	connectionString := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.Username, config.Password, config.Host, config.Port, config.Database)

	dbConnection, err := gorm.Open(mysql.Open(connectionString), &gorm.Config{})
	fmt.Println("DB URI : ", connectionString)

	if err != nil {
		panic(err.Error())
	}

	return dbConnection
}
