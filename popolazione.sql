-- Popolazione del database (grazie chatgpt)
-- Inserimento utenti, le password sono la stringa: "passX" dove X è il numero dell'utente partendo da 1, per Marina Ribaudo è ziaribba
INSERT INTO Utente (email, firstname, lastname, username, pass) VALUES
('email11@example.com', 'Ava', 'Anderson', 'AvaSon', '$2y$10$JcHRLcAfU8jir0N5pxEI4.TJpfKAMU3Et4t6Ftr.8f3xu2CsQ0GiW'),
('email12@example.com', 'Liam', 'Harris', 'Lirrs', '$2y$10$H2kv66.wclNP5SxU9WyfOe2Bj4bs6B1EU60vxkTrryi.95UJRSSt6'),
('email13@example.com', 'Ella', 'Thompson', 'Elly', '$2y$10$UliaAmIXCE5wVvwrnGQl5.Brzb277CFja2JirQsmpWBPEORt8kHJy'),
('email14@example.com', 'Mason', 'Garcia', 'Marcia', '$2y$10$aAmPqTTfhxqbQQaxkctpdeQ2YgafvqQ9ix9LsN3K0P/WVV/17tIoG'),
('email15@example.com', 'Grace', 'Davis', 'Gracy11', '$2y$10$4Or6MbDioKr867JHQETT7uNqVOpfWszfEuV9dzXkW6NjxM2zDXom6'),
('email16@example.com', 'Ethan', 'Robinson', 'Eth21', '$2y$10$3cA7C7phCP0p2zriuhcXHu/rwjDbrv/3tJVBvme5WCXU2aBckuZgG'),
('email17@example.com', 'Lily', 'Clark', 'Lillz', '$2y$10$c99s2O/CW8oNJY8HPMi5uumic8l063itdhU2tZq.H2hJm1bhJadt2'),
('email18@example.com', 'Logan', 'White', 'Log', '$2y$10$7nyijwDH7KHOJqG6sp5kL.LRgPg50b36.Y5o0WpIBvG8iAFcociJK'),
('email19@example.com', 'Aiden', 'Miller', 'MMEggs', '$2y$10$Em7rQRVASJqzlv8KHroFd.BNf4iUdz10xerX.5KLGwrewU3prMVeO'),
('email20@example.com', 'Zoe', 'Lee', 'Zee', '$2y$10$htujX6L4KjSIvH4CG8BX6.RKUIQyrFDSpDElTuJXOQ.FQdOZfs9ey'),
('email21@example.com', 'Marina', 'Ribaudo', 'ZiaRibba', '$2y$10$.QEw7NFCdCyjRbSUjJVnQ.98lSPRtCHMZDT8nR0mPpY...');

-- Inserimento post
INSERT INTO Post (idUtente, urlImmagine) VALUES
(7, 'image_url11.jpg'),
(8, 'image_url12.jpg'),
(9, 'image_url13.jpg'),
(1, 'image_url14.jpg'),
(1, 'image_url15.jpg'),
(2, 'image_url16.jpg'),
(3, 'image_url17.jpg'),
(4, 'image_url18.jpg'),
(5, 'image_url19.jpg'),
(6, 'image_url20.jpg');

INSERT INTO post (IdUtente, oraPubblicazione, urlImmagine)
VALUES
  (11, '2022-02-09 15:30:00', 'javascript1.jpg'),
  (11, '2022-02-09 14:45:00', 'javascript2.png'),
  (11, '2022-02-08 17:20:00', 'javascript3.jpg'),
  (11, '2022-02-08 10:00:00', 'javascript6.jpg'),
  (11, '2022-02-08 11:30:00', 'javascript7.jpg'),
  (11, '2022-02-08 12:45:00', 'javascript4.jpg'),
  (11, '2022-02-09 08:00:00', 'javascript5.jpg'),
  (11, '2022-02-09 13:10:00', 'javascript8.jpg'),
  (11, '2022-02-09 15:30:00', 'PHP1.jpg'),
  (11, '2022-02-09 14:45:00', 'PHP2.jpg'),
  (11, '2022-02-08 17:20:00', 'PHP3.jpg'),
  (11, '2022-02-08 10:00:00', 'PHP4.png'),
  (11, '2022-02-08 11:30:00', 'PHP5.png'),
  (11, '2022-02-08 12:45:00', 'PHP6.jpg'),
  (11, '2022-02-09 08:00:00', 'PHP7.jpg'),
  (11, '2022-02-09 13:10:00', 'PHP8.png'),
  (11, '2022-02-09 13:10:00', 'PHP9.jpg');

-- Inserimento like
INSERT INTO Liked (idUtente, idPost) VALUES
(7, 8),
(8, 9),
(9, 1),
(1, 7),
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 6),
(6, 7);

-- Inserimento follow
INSERT INTO Seguiti (idUtente, idUtenteSeguito) VALUES
(7, 8),
(8, 9),
(9, 1),
(1, 7),
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 6),
(6, 7);

-- Inserimento cartella salvati
INSERT INTO CartellaSalvati (idUtente) VALUES
(7),
(8),
(9),
(1),
(7),
(8),
(9),
(1),
(2),
(2);

-- Inserimento post salvati
INSERT INTO Salvati (idCartella, idPost) VALUES
(7, 4),
(8, 5),
(9, 6),
(2, 7),
(7, 8),
(8, 9),
(9, 1),
(1, 7),
(1, 8),
(2, 9);
