
-- DATABASE SCHEMA FOR BLOG PROJECT

-- Tạo database
CREATE DATABASE IF NOT EXISTS blog_project CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE blog_project;

-- BẢNG USERS (Người dùng)

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    avatar VARCHAR(255),
    role ENUM('admin', 'user') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- BẢNG CATEGORIES (Danh mục blog)

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BẢNG BLOGS (Bài viết)

CREATE TABLE blogs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    featured_image VARCHAR(255),
    user_id INT NOT NULL,
    category_id INT,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    views INT DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_user_id (user_id),
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BẢNG TAGS (Thẻ tag)

CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BẢNG BLOG_TAGS (Quan hệ nhiều-nhiều Blog-Tags)

CREATE TABLE blog_tags (
    blog_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (blog_id, tag_id),
    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BẢNG REFRESH_TOKENS (Lưu refresh token)
CREATE TABLE refresh_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- SEED DATA (Dữ liệu mẫu)


-- Insert Users (password: "password123" đã hash)
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@blog.com', '$2a$10$YourHashedPasswordHere', 'Admin User', 'admin'),
('john_doe', 'john@example.com', '$2a$10$YourHashedPasswordHere', 'John Doe', 'user'),
('jane_smith', 'jane@example.com', '$2a$10$YourHashedPasswordHere', 'Jane Smith', 'user');

-- Insert Categories
INSERT INTO categories (name, slug, description) VALUES
('Technology', 'technology', 'Articles about technology and innovation'),
('Travel', 'travel', 'Travel guides and experiences'),
('Food', 'food', 'Recipes and food reviews'),
('Lifestyle', 'lifestyle', 'Lifestyle tips and trends'),
('Business', 'business', 'Business insights and strategies');

-- Insert Tags
INSERT INTO tags (name, slug) VALUES
('JavaScript', 'javascript'),
('Vue.js', 'vuejs'),
('Node.js', 'nodejs'),
('Tutorial', 'tutorial'),
('Tips', 'tips'),
('Guide', 'guide'),
('Review', 'review');

-- Insert Blogs
INSERT INTO blogs (title, slug, content, excerpt, user_id, category_id, status, published_at) VALUES
(
    'Getting Started with Vue 3',
    'getting-started-vue3',
    'Vue 3 is the latest version of Vue.js framework. In this article, we will explore the new features and improvements...',
    'Learn the basics of Vue 3 and its new features',
    2,
    1,
    'published',
    NOW()
),
(
    'Top 10 Travel Destinations 2025',
    'top-10-travel-destinations-2025',
    'Discover the most amazing travel destinations for 2025. From tropical beaches to mountain adventures...',
    'Explore the best places to visit in 2025',
    3,
    2,
    'published',
    NOW()
),
(
    'Healthy Eating Guide',
    'healthy-eating-guide',
    'A comprehensive guide to healthy eating habits and nutritious meal planning...',
    'Tips for maintaining a healthy diet',
    2,
    3,
    'draft',
    NULL
);

-- Insert Blog Tags relationships
INSERT INTO blog_tags (blog_id, tag_id) VALUES
(1, 2), -- Vue.js
(1, 4), -- Tutorial
(2, 6), -- Guide
(3, 5); -- Tips

-- USEFUL QUERIES FOR TESTING


-- Get all published blogs with author and category
-- SELECT b.*, u.username, u.full_name, c.name as category_name
-- FROM blogs b
-- LEFT JOIN users u ON b.user_id = u.id
-- LEFT JOIN categories c ON b.category_id = c.id
-- WHERE b.status = 'published'
-- ORDER BY b.created_at DESC;

-- Get blog with tags
-- SELECT b.title, GROUP_CONCAT(t.name) as tags
-- FROM blogs b
-- LEFT JOIN blog_tags bt ON b.id = bt.blog_id
-- LEFT JOIN tags t ON bt.tag_id = t.id
-- GROUP BY b.id;