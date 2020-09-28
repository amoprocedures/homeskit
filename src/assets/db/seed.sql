CREATE TABLE IF NOT EXISTS items (
  	id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  	u_id CHAR(65),
  	name VARCHAR(45),
  	quantity DOUBLE,
  	unit_price DOUBLE,
  	description TEXT,
  	user_id CHAR(65),
  	created_at DATETIME,
  	is_deleted INTEGER
);

CREATE UNIQUE INDEX idx_item_index ON items (u_id,user_id);
