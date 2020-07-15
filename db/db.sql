CREATE TABLE `numberz`.`accounts` (
  `acoount_id` INT NOT NULL AUTO_INCREMENT,
  `account_name` VARCHAR(45) NOT NULL,
  `details` VARCHAR(45) NULL,
  `creation_date` VARCHAR(45) NULL,
  PRIMARY KEY (`acoount_id`),
  UNIQUE INDEX `account_name_UNIQUE` (`account_name` ASC),
  UNIQUE INDEX `acoount_id_UNIQUE` (`acoount_id` ASC));

  CREATE TABLE `numberz`.`customers` (
  `customer_id` INT NOT NULL,
  `customer_name` VARCHAR(45) NOT NULL,
  `customer_details` VARCHAR(45) NULL,
  `reminder_enables` TINYINT NOT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE INDEX `customer_name_UNIQUE` (`customer_name` ASC),
  UNIQUE INDEX `customer_id_UNIQUE` (`customer_id` ASC));

  CREATE TABLE `numberz`.`invoices` (
  `invoice_id` INT NOT NULL AUTO_INCREMENT,
  `invoice_name` VARCHAR(45) NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `acccount_id` INT NOT NULL,
  `customer_id` INT NOT NULL,
  `payment_status` TINYINT NULL,
  PRIMARY KEY (`invoice_id`),
  UNIQUE INDEX `invoice_id_UNIQUE` (`invoice_id` ASC),
  INDEX `fk_invoices_1_idx` (`acccount_id` ASC),
  INDEX `fk_invoices_2_idx` (`customer_id` ASC),
  CONSTRAINT `fk_invoices_1`
    FOREIGN KEY (`acccount_id`)
    REFERENCES `numberz`.`accounts` (`acoount_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_invoices_2`
    FOREIGN KEY (`customer_id`)
    REFERENCES `numberz`.`customers` (`customer_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    )

CREATE TABLE `numberz`.`reminders` (
  `reminder_id` INT NOT NULL AUTO_INCREMENT,
  `invoice_id` INT NOT NULL,
  `reminder_date` TIMESTAMP NOT NULL,
  `template_id` INT NULL,
  `reminder_type` ENUM('manual', 'auto', 'all') NOT NULL,
  `reminder_method` ENUM('sms', 'email', 'all') NOT NULL,
  `status` ENUM('sent', 'not_sent', 'failed') NOT NULL,
  `days_to_due` INT NOT NULL,
  PRIMARY KEY (`reminder_id`),
  INDEX `fk_reminders_1_idx` (`template_id` ASC),
  INDEX `fk_reminders_2_idx` (`invoice_id` ASC),
  CONSTRAINT `fk_reminders_1`
    FOREIGN KEY (`template_id`)
    REFERENCES `numberz`.`templates` (`template_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_reminders_2`
    FOREIGN KEY (`invoice_id`)
    REFERENCES `numberz`.`invoices` (`invoice_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

insert into templates(template_name,location) values("default_template","/home");
insert into accounts(account_name,details) values("default","basically a default account to do stuff");
insert into invoices(invoice_name,acccount_id,customer_id,payment_status) values ("test",1,1,false)
