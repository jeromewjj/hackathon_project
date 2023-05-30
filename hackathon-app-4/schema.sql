DROP TABLE IF EXISTS market_values;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS investments;
DROP TABLE IF EXISTS instruments;

CREATE TABLE instruments (
                             instrument_id int NOT NULL AUTO_INCREMENT,
                             instrument_name varchar(255) NOT NULL,
                             instrument_type ENUM('Real Estate', 'Private Equity') not null,
                             country char(5) not null,
                             sector varchar(64) NOT NULL,
                             instrument_currency varchar(64) NOT NULL,
                             is_tradeable boolean NOT NULL,
                             created_at datetime NOT NULL,
                             modified_at datetime NOT NULL,
                             deleted_at datetime default NULL,
                             notes varchar(255),
                             PRIMARY KEY (instrument_id)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

CREATE TABLE market_values (
                               id int NOT NULL AUTO_INCREMENT,
                               instrument_id int NOT NULL,
                               market_value double NOT NULL,
                               market_value_date date NOT NULL,
                               created_at datetime NOT NULL,
                               modified_at datetime NOT NULL,
                               PRIMARY KEY (id),
                               FOREIGN KEY (instrument_id) REFERENCES instruments(instrument_id)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

CREATE TABLE transactions (
                              transaction_id int NOT NULL,
                              instrument_id int NOT NULL,
                              quantity int NOT NULL,
                              transaction_date datetime NOT NULL,
                              transaction_amount double NOT NULL,
                              transaction_currency varchar(64) NOT NULL,
                              transaction_type ENUM('BUY', 'SELL') not null,
                              is_cancelled boolean NOT NULL,
                              created_at datetime NOT NULL,
                              modified_at datetime NOT NULL,
                              deleted_at datetime default NULL,
                              PRIMARY KEY (transaction_id),
                              FOREIGN KEY (instrument_id) REFERENCES instruments(instrument_id)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

CREATE TABLE investments (
                             instrument_id int NOT NULL,
                             cumulative_quantity int NOT NULL,
                             cumulative_transaction_amount double NOT NULL,
                             refresh_datetime datetime NOT NULL,
                             created_at datetime NOT NULL,
                             PRIMARY KEY (instrument_id, refresh_datetime),
                             FOREIGN KEY (instrument_id) REFERENCES instruments(instrument_id)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;