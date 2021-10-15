INSERT INTO users (name, email, password)
VALUES ('Charlie Keashly', 'charlie@gmail.com', '123'),
('Reggie Keashly', 'reggie@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Miko Keashly', 'miko@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');


INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES(1, 'Speed lamp', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 951.70, 1, 2, 3, 'Canada', 'Bowen Drive', 'Richmond', 'BC', 'V7C 4H5', true),
(2, 'Blank corner', 'description', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 1005.20,2, 3, 3, 'Canada', 'Dayanee Springs', 'Coquitlam', 'BC', 'V3E 0B9', true),
(2, 'Habit mix', 'description', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg', 1234.20,4, 2, 3, 'Canada', 'Jensen Road', 'Lake Country', 'BC', 'V4V 1S6', true);


INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES('2018-09-11', '2018-09-26', 1, 1), ('2019-01-04', '2019-02-01', 2, 2), ('2021-10-01', '2021-10-14', 3, 3);



INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES(2, 2, 3, 4, 'Loved it here!'), (1, 1, 2, 3, 'Nice, but small!'), (3, 3, 1, 5, 'Absolutely love it!'); 