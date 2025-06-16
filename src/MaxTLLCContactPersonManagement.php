<?php declare(strict_types=1);

namespace MaxTLLC\MaxTLLCContactPersonManagement;

use Doctrine\DBAL\Connection;
use Exception;
use Shopware\Core\Framework\Plugin;
use Shopware\Core\Framework\Plugin\Context\UninstallContext;

class MaxTLLCContactPersonManagement extends Plugin
{
    public function uninstall(UninstallContext $uninstallContext): void
    {
        parent::uninstall($uninstallContext);

        $connection = $this->container->get(Connection::class);

        try {
            $tableName = 'maxtllc_contact_person';

            $tableExists = $connection->executeQuery(
                    "SHOW TABLES LIKE '$tableName'"
                )->rowCount() > 0;

            if ($tableExists) {
                // Drop any foreign keys first
                $foreignKeys = $connection->executeQuery(
                    "SELECT CONSTRAINT_NAME 
                     FROM information_schema.TABLE_CONSTRAINTS 
                     WHERE CONSTRAINT_SCHEMA = DATABASE() 
                     AND TABLE_NAME = '$tableName' 
                     AND CONSTRAINT_TYPE = 'FOREIGN KEY'"
                )->fetchAllAssociative();

                foreach ($foreignKeys as $foreignKey) {
                    try {
                        $connection->executeStatement(
                            "ALTER TABLE `$tableName` DROP FOREIGN KEY `{$foreignKey['CONSTRAINT_NAME']}`"
                        );
                    } catch (Exception $e) {
                        error_log("Failed to drop foreign key {$foreignKey['CONSTRAINT_NAME']}: " . $e->getMessage());
                    }
                }

                // Now drop the table
                $connection->executeStatement("DROP TABLE `$tableName`");
            }

            // Remove migration entries if user data isn't kept
            if (!$uninstallContext->keepUserData()) {
                $connection->executeStatement(
                    "DELETE FROM `migration` WHERE `class` LIKE 'MaxTLLC\\\\MaxTLLCContactPersonManagement\\\\Migration\\\\Migration%'"
                );
            }
        } catch (Exception $e) {
            error_log('Error during uninstallation: ' . $e->getMessage());
        }
    }
}