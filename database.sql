-- 宗靖招赢平台 V1 数据库设计
-- 数据库名: zongjing

CREATE DATABASE IF NOT EXISTS zongjing DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zongjing;

-- ----------------------------
-- 1. 后台用户表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码(加密)',
  `name` VARCHAR(50) COMMENT '姓名',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='后台用户表';

-- 插入默认管理员
INSERT INTO `users` (`username`, `password`, `name`) VALUES
('admin', '$2b$10$YourHashedPasswordHere', '管理员');

-- ----------------------------
-- 2. 项目表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT '项目名称',
  `city` VARCHAR(50) NOT NULL COMMENT '城市',
  `address` VARCHAR(200) COMMENT '地址',
  `total_area` INT COMMENT '总面积(㎡)',
  `description` TEXT COMMENT '描述',
  `cover_image` VARCHAR(255) COMMENT '封面图片',
  `min_rent` DECIMAL(10,2) COMMENT '最低租金',
  `business_type` VARCHAR(100) COMMENT '业态',
  `status` VARCHAR(20) DEFAULT 'active' COMMENT '状态: active/inactive',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目表';

-- ----------------------------
-- 3. 铺位表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `shops` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL COMMENT '所属项目ID',
  `shop_code` VARCHAR(50) NOT NULL COMMENT '铺位编号',
  `floor` VARCHAR(20) COMMENT '楼层',
  `area` INT COMMENT '面积(㎡)',
  `rent` DECIMAL(10,2) COMMENT '租金(元/月)',
  `business_type` VARCHAR(100) COMMENT '业态',
  `status` VARCHAR(20) DEFAULT 'available' COMMENT '状态: available/occupied/reserved',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='铺位表';

-- ----------------------------
-- 4. 客户表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `brand_name` VARCHAR(100) NOT NULL COMMENT '品牌名称',
  `contact_name` VARCHAR(50) COMMENT '联系人',
  `phone` VARCHAR(20) NOT NULL COMMENT '电话',
  `brand_type` VARCHAR(100) COMMENT '业态/品牌类型',
  `store_count` INT COMMENT '门店数量',
  `intention_area` VARCHAR(50) COMMENT '意向面积',
  `intention_city` VARCHAR(50) COMMENT '意向城市',
  `level` VARCHAR(10) DEFAULT 'C' COMMENT '等级: A/B/C',
  `status` VARCHAR(20) DEFAULT 'new' COMMENT '状态',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客户表';

-- ----------------------------
-- 5. 线索表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `leads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_name` VARCHAR(100) NOT NULL COMMENT '客户名称',
  `phone` VARCHAR(20) NOT NULL COMMENT '电话',
  `industry` VARCHAR(100) COMMENT '行业',
  `level` VARCHAR(10) DEFAULT 'C' COMMENT '等级: A/B/C',
  `status` VARCHAR(20) DEFAULT 'new' COMMENT '状态: new/following/closed/lost',
  `intention_area` VARCHAR(50) COMMENT '意向面积',
  `intention_city` VARCHAR(50) COMMENT '意向城市',
  `source` VARCHAR(50) COMMENT '来源',
  `next_follow_time` DATETIME COMMENT '下次跟进时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='线索表';

-- ----------------------------
-- 6. 跟进记录表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `follow_records` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lead_id` INT NOT NULL COMMENT '线索ID',
  `content` TEXT NOT NULL COMMENT '跟进内容',
  `follow_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '跟进时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='跟进记录表';

-- ----------------------------
-- 7. 入驻申请表(前台)
-- ----------------------------
CREATE TABLE IF NOT EXISTS `applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT COMMENT '项目ID',
  `brand_name` VARCHAR(100) NOT NULL COMMENT '品牌名称',
  `contact_name` VARCHAR(50) COMMENT '联系人',
  `phone` VARCHAR(20) NOT NULL COMMENT '电话',
  `intention_area` VARCHAR(50) COMMENT '意向面积',
  `intention_city` VARCHAR(50) COMMENT '意向城市',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态: pending/processed/closed',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='入驻申请表';

-- ----------------------------
-- 8. 客户标签表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `customer_tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL COMMENT '客户ID',
  `tag_key` VARCHAR(100) NOT NULL COMMENT '标签键',
  `tag_value` VARCHAR(100) NOT NULL COMMENT '标签值',
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客户标签表';

-- ----------------------------
-- 9. 项目标签表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `project_tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL COMMENT '项目ID',
  `tag_key` VARCHAR(100) NOT NULL COMMENT '标签键',
  `tag_value` VARCHAR(100) NOT NULL COMMENT '标签值',
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目标签表';

-- ----------------------------
-- 10. 推荐记录表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `recommendations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL COMMENT '客户ID',
  `project_id` INT NOT NULL COMMENT '项目ID',
  `score` INT COMMENT '匹配分数',
  `reason` VARCHAR(255) COMMENT '推荐原因',
  `feedback_score` INT COMMENT '反馈分数',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='推荐记录表';

-- ----------------------------
-- 测试数据
-- ----------------------------
INSERT INTO `projects` (`name`, `city`, `address`, `total_area`, `description`, `business_type`, `min_rent`) VALUES
('星港城购物中心', '广州', '天河区珠江新城花城大道', 50000, '广州核心商圈大型商业综合体', '餐饮/零售/娱乐', 200),
('龙华万达广场', '深圳', '龙华区人民南路', 30000, '深圳北部新城核心商业体', '餐饮/服装/儿童', 150),
('杭州银泰城', '杭州', '西湖区文三路', 40000, '杭州西湖区标杆商业项目', '全业态', 180);

INSERT INTO `shops` (`project_id`, `shop_code`, `floor`, `area`, `rent`, `business_type`, `status`) VALUES
(1, 'A101', '1F', 100, 50000, '餐饮', 'available'),
(1, 'A102', '1F', 80, 40000, '零售', 'available'),
(1, 'B201', '2F', 150, 60000, '餐饮', 'occupied'),
(2, 'C101', '1F', 120, 45000, '服装', 'available'),
(2, 'C102', '1F', 90, 35000, '儿童', 'reserved'),
(3, 'D301', '3F', 200, 55000, '餐饮', 'available');

INSERT INTO `leads` (`customer_name`, `phone`, `industry`, `level`, `status`, `intention_area`, `intention_city`, `next_follow_time`) VALUES
('星巴克', '13800138001', '咖啡', 'A', 'following', '100-200㎡', '广州', NOW()),
('麦当劳', '13800138002', '快餐', 'A', 'new', '150-250㎡', '深圳', NULL),
('肯德基', '13800138003', '快餐', 'B', 'following', '100-200㎡', '广州', NOW()),
('优衣库', '13800138004', '服装', 'A', 'closed', '200-300㎡', '杭州', NULL),
('海底捞', '13800138005', '餐饮', 'A', 'new', '300-500㎡', '广州', NULL);

INSERT INTO `follow_records` (`lead_id`, `content`, `follow_time`) VALUES
(1, '客户表示有兴趣，需要进一步沟通租金优惠', NOW()),
(1, '已发送项目资料，约下周实地考察', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, '初次电话沟通，意向强烈', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(4, '已签约，感谢关注', DATE_SUB(NOW(), INTERVAL 10 DAY));

INSERT INTO `customers` (`brand_name`, `contact_name`, `phone`, `brand_type`, `store_count`, `intention_area`, `intention_city`, `level`) VALUES
('星巴克', '李经理', '13800138001', '咖啡', 50, '100-200㎡', '广州', 'A'),
('麦当劳', '王经理', '13800138002', '快餐', 30, '150-250㎡', '深圳', 'A'),
('肯德基', '张经理', '13800138003', '快餐', 20, '100-200㎡', '广州', 'B'),
('优衣库', '赵经理', '13800138004', '服装', 100, '200-300㎡', '杭州', 'A'),
('瑞幸咖啡', '刘经理', '13800138006', '咖啡', 10, '80-150㎡', '广州', 'B');

INSERT INTO `applications` (`project_id`, `brand_name`, `contact_name`, `phone`, `intention_area`, `intention_city`) VALUES
(1, '一点点奶茶', '陈先生', '13900139001', '50-80㎡', '广州'),
(1, '喜茶', '周先生', '13900139002', '100-150㎡', '广州'),
(2, '奈雪的茶', '林先生', '13900139003', '80-120㎡', '深圳');