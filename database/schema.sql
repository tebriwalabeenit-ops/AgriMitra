-- ============================================================================
-- KrishiLink (AgriMitra) Relational Database Schema
-- Standard Indian Hackathon (SIH) 2026
-- Compatible with MySQL 8.0+ / MariaDB 10.4+
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `krishilink_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `krishilink_db`;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `phone` VARCHAR(15) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('farmer', 'fpo', 'distributor', 'delivery_agent') NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NULL,
    `state` VARCHAR(50) NULL,
    `district` VARCHAR(50) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_phone` (`phone`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. FARMERS PROFILE TABLE
CREATE TABLE IF NOT EXISTS `farmers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL UNIQUE,
    `kisan_id` VARCHAR(50) NOT NULL UNIQUE,
    `farm_location` VARCHAR(150) NULL,
    `primary_crops` VARCHAR(255) NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. FPO PROFILE TABLE
CREATE TABLE IF NOT EXISTS `fpos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL UNIQUE,
    `fpo_code` VARCHAR(50) NOT NULL UNIQUE,
    `fpo_name` VARCHAR(150) NOT NULL,
    `reg_number` VARCHAR(100) NULL,
    `warehouse_location` VARCHAR(150) NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. DISTRIBUTORS / WHOLESALERS PROFILE TABLE
CREATE TABLE IF NOT EXISTS `distributors` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL UNIQUE,
    `distributor_code` VARCHAR(50) NOT NULL UNIQUE,
    `business_name` VARCHAR(150) NOT NULL,
    `business_type` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `storage_capacity` VARCHAR(50) NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. DELIVERY AGENTS PROFILE TABLE
CREATE TABLE IF NOT EXISTS `delivery_agents` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL UNIQUE,
    `agent_code` VARCHAR(50) NOT NULL UNIQUE,
    `vehicle_type` VARCHAR(50) NULL,
    `vehicle_number` VARCHAR(50) NULL,
    `status` VARCHAR(30) DEFAULT 'available',
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. PRODUCE LISTINGS TABLE
CREATE TABLE IF NOT EXISTS `produce` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `farmer_id` INT NOT NULL,
    `crop_name` VARCHAR(100) NOT NULL,
    `variety` VARCHAR(100) NULL,
    `quantity` DECIMAL(10,2) NOT NULL,
    `unit` VARCHAR(30) DEFAULT 'kg',
    `expected_price` DECIMAL(10,2) NOT NULL,
    `location` VARCHAR(150) NULL,
    `status` ENUM('active', 'sold', 'unlisted') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`farmer_id`) REFERENCES `farmers`(`id`) ON DELETE CASCADE,
    INDEX `idx_produce_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. FARMER DELIVERY REQUIREMENTS (Dispatched to Delivery Agents)
CREATE TABLE IF NOT EXISTS `farmer_requirements` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `req_code` VARCHAR(50) NOT NULL UNIQUE,
    `farmer_id` INT NOT NULL,
    `produce_id` INT NULL,
    `crop_name` VARCHAR(100) NOT NULL,
    `quantity` DECIMAL(10,2) NOT NULL,
    `unit` VARCHAR(30) DEFAULT 'kg',
    `pickup_location` VARCHAR(150) NOT NULL,
    `destination_location` VARCHAR(150) NOT NULL,
    `pickup_window` VARCHAR(100) NULL,
    `notes` TEXT NULL,
    `compensation` DECIMAL(10,2) DEFAULT 0.00,
    `trip_distance_km` DECIMAL(6,2) DEFAULT 0.00,
    `delivery_agent_id` INT NULL,
    `status` ENUM('pending', 'accepted', 'in_transit', 'delivered', 'cancelled') DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `accepted_at` TIMESTAMP NULL,
    `delivered_at` TIMESTAMP NULL,
    FOREIGN KEY (`farmer_id`) REFERENCES `farmers`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`produce_id`) REFERENCES `produce`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`delivery_agent_id`) REFERENCES `delivery_agents`(`id`) ON DELETE SET NULL,
    INDEX `idx_req_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. AUCTIONS TABLE (FPO Live Bidding)
CREATE TABLE IF NOT EXISTS `auctions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `lot_code` VARCHAR(50) NOT NULL UNIQUE,
    `fpo_id` INT NOT NULL,
    `product_name` VARCHAR(100) NOT NULL,
    `category` VARCHAR(50) DEFAULT 'grains',
    `description` TEXT NULL,
    `quality_grade` VARCHAR(20) DEFAULT 'A',
    `quality_specs` VARCHAR(255) NULL,
    `quantity` DECIMAL(10,2) NOT NULL,
    `unit` VARCHAR(30) DEFAULT 'kg',
    `starting_price` DECIMAL(10,2) NOT NULL,
    `min_increment` DECIMAL(10,2) NOT NULL DEFAULT 0.50,
    `current_highest_bid` DECIMAL(10,2) NOT NULL,
    `current_highest_bidder_id` INT NULL,
    `start_time` DATETIME NOT NULL,
    `end_time` DATETIME NOT NULL,
    `status` ENUM('upcoming', 'active', 'ended', 'cancelled') DEFAULT 'active',
    `winner_id` INT NULL,
    `image_url` VARCHAR(255) NULL,
    `hub_location` VARCHAR(150) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`fpo_id`) REFERENCES `fpos`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`current_highest_bidder_id`) REFERENCES `distributors`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`winner_id`) REFERENCES `distributors`(`id`) ON DELETE SET NULL,
    INDEX `idx_auctions_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. BIDS TABLE (Immutable bid history)
CREATE TABLE IF NOT EXISTS `bids` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `auction_id` INT NOT NULL,
    `distributor_id` INT NOT NULL,
    `bidder_tag` VARCHAR(50) NOT NULL,
    `bid_amount` DECIMAL(10,2) NOT NULL,
    `bid_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`auction_id`) REFERENCES `auctions`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`distributor_id`) REFERENCES `distributors`(`id`) ON DELETE CASCADE,
    INDEX `idx_bids_auction` (`auction_id`, `bid_amount` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. ORDERS TABLE
CREATE TABLE IF NOT EXISTS `orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_code` VARCHAR(50) NOT NULL UNIQUE,
    `auction_id` INT NULL,
    `distributor_id` INT NOT NULL,
    `fpo_id` INT NULL,
    `farmer_id` INT NULL,
    `product_name` VARCHAR(100) NOT NULL,
    `quantity` DECIMAL(10,2) NOT NULL,
    `unit` VARCHAR(30) DEFAULT 'kg',
    `price_per_unit` DECIMAL(10,2) NOT NULL,
    `total_amount` DECIMAL(12,2) NOT NULL,
    `status` ENUM('pending', 'confirmed', 'processing', 'in_transit', 'delivered', 'cancelled') DEFAULT 'confirmed',
    `payment_status` ENUM('pending', 'escrow_held', 'settled', 'failed') DEFAULT 'escrow_held',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`auction_id`) REFERENCES `auctions`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`distributor_id`) REFERENCES `distributors`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`fpo_id`) REFERENCES `fpos`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`farmer_id`) REFERENCES `farmers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(50) DEFAULT 'info',
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_notif_user` (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
