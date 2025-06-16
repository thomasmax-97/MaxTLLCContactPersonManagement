<?php declare(strict_types=1);

namespace MaxTLLC\MaxTLLCContactPersonManagement\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

/**
 * @internal
 */
class Migration1748856536CreateContactPersonTable extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1748856536;
    }

    public function update(Connection $connection): void
    {
        $sql = <<<SQL
            CREATE TABLE IF NOT EXISTS `maxtllc_contact_person` (
                `id` BINARY(16) NOT NULL,
                `first_name` VARCHAR(255) NOT NULL,
                `last_name` VARCHAR(255) NOT NULL,
                `email` VARCHAR(255) NOT NULL,
                `phone` VARCHAR(255) NULL,
                `customer_id` BINARY(16) NULL,
                `active` TINYINT(1) NOT NULL DEFAULT 1,
                `image_id` BINARY(16) NULL,
                `created_at` DATETIME(3) NOT NULL,
                `updated_at` DATETIME(3) NULL,
                PRIMARY KEY (`id`),
                KEY `idx_customer_id` (`customer_id`),
                CONSTRAINT `fk_maxtllc_contact_person_customer`
                    FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE CASCADE,
                CONSTRAINT `fk_maxtllc_contact_person_media`
                    FOREIGN KEY (`image_id`) REFERENCES `media` (`id`) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        SQL;

        $connection->executeStatement($sql);
    }
}
