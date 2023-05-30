DROP TABLE IF EXISTS `instruments`;
DROP TABLE IF EXISTS `market-values`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `investments`;

CREATE TABLE `instruments` (
                               `instrument_id` int NOT NULL,
                               `instrument_name` varchar(255) NOT NULL,
                               `instrument_type` ENUM('Real Estate', 'Private Equity') not null,
                               `country` char(5) not null,
                               `sector` varchar(64) NOT NULL,
                               `instrument_currency` varchar(64) NOT NULL,
                               `is_tradeable` boolean NOT NULL,
                               `created_at` datetime NOT NULL,
                               `modified_at` datetime NOT NULL,
                               `deleted_at` datetime default "0000-00-00 00:00:00",
                               `notes` varchar(255),
                               PRIMARY KEY (`instrument_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

CREATE TABLE `market-values` (
                                 `instrument_id` int NOT NULL,
                                 `market_value` double NOT NULL,
                                 `market_value_date` datetime NOT NULL,
                                 `created_at` datetime NOT NULL,
                                 `modified_at` datetime NOT NULL,
                                 PRIMARY KEY (`instrument_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

CREATE TABLE `transactions` (
                                `transaction_id` int NOT NULL,
                                `instrument_id` int NOT NULL,
                                `quantity` int NOT NULL,
                                `transaction_date` datetime NOT NULL,
                                `transaction_amount` double NOT NULL,
                                `transaction_type` ENUM('BUY', 'SELL') not null,
                                `is_cancelled` boolean NOT NULL,
                                `created_at` datetime NOT NULL,
                                `modified_at` datetime NOT NULL,
                                PRIMARY KEY (`transaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

CREATE TABLE `investments` (
                               `instrument_id` int NOT NULL,
                               `cumulative_quantity` int NOT NULL,
                               `cumulative_transaction_amount` long NOT NULL,
                               `refresh_datetime` datetime NOT NULL,
                               PRIMARY KEY (`instrument_id`, `refresh_datetime`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

