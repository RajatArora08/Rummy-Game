CREATE SEQUENCE player_sequence;
ALTER TABLE players ALTER COLUMN player_id SET DEFAULT nextval('player_sequence');
ALTER TABLE players ALTER COLUMN player_id SET NOT NULL;


delete from cards;

INSERT INTO cards(card_id, rank, suit) VALUES ( 1,1,'C');
INSERT INTO cards(card_id, rank, suit) VALUES ( 2,2,'C');
INSERT INTO cards(card_id, rank, suit) VALUES ( 3,3,'C');
INSERT INTO cards(card_id, rank, suit) VALUES ( 4,4,'C');
INSERT INTO cards(card_id, rank, suit) VALUES ( 5,5,'C');
INSERT INTO cards(card_id, rank, suit) VALUES ( 6,6,'C');
INSERT INTO cards(card_id, rank, suit) VALUES ( 7,7,'C');
INSERT INTO cards(card_id, rank, suit) VALUES ( 8,8,'C');
INSERT INTO cards(card_id, rank, suit) VALUES ( 9,9,'C');
INSERT INTO cards(card_id, rank, suit) VALUES ( 10,10,'C');
INSERT INTO cards(card_id, rank, suit) VALUES ( 11,11,'C');
INSERT INTO cards(card_id, rank, suit) VALUES ( 12,12,'C');
INSERT INTO cards(card_id, rank, suit) VALUES ( 13,13,'C');
INSERT INTO cards(card_id, rank, suit) VALUES ( 14,1,'D');
INSERT INTO cards(card_id, rank, suit) VALUES ( 15,2,'D');
INSERT INTO cards(card_id, rank, suit) VALUES ( 16,3,'D');
INSERT INTO cards(card_id, rank, suit) VALUES ( 17,4,'D');
INSERT INTO cards(card_id, rank, suit) VALUES ( 18,5,'D');
INSERT INTO cards(card_id, rank, suit) VALUES ( 19,6,'D');
INSERT INTO cards(card_id, rank, suit) VALUES ( 20,7,'D');
INSERT INTO cards(card_id, rank, suit) VALUES ( 21,8,'D');
INSERT INTO cards(card_id, rank, suit) VALUES ( 22,9,'D');
INSERT INTO cards(card_id, rank, suit) VALUES ( 23,10,'D');
INSERT INTO cards(card_id, rank, suit) VALUES ( 24,11,'D');
INSERT INTO cards(card_id, rank, suit) VALUES ( 25,12,'D');
INSERT INTO cards(card_id, rank, suit) VALUES ( 26,13,'D');
INSERT INTO cards(card_id, rank, suit) VALUES ( 27,1,'H');
INSERT INTO cards(card_id, rank, suit) VALUES ( 28,2,'H');
INSERT INTO cards(card_id, rank, suit) VALUES ( 29,3,'H');
INSERT INTO cards(card_id, rank, suit) VALUES ( 30,4,'H');
INSERT INTO cards(card_id, rank, suit) VALUES ( 31,5,'H');
INSERT INTO cards(card_id, rank, suit) VALUES ( 32,6,'H');
INSERT INTO cards(card_id, rank, suit) VALUES ( 33,7,'H');
INSERT INTO cards(card_id, rank, suit) VALUES ( 34,8,'H');
INSERT INTO cards(card_id, rank, suit) VALUES ( 35,9,'H');
INSERT INTO cards(card_id, rank, suit) VALUES ( 36,10,'H');
INSERT INTO cards(card_id, rank, suit) VALUES ( 37,11,'H');
INSERT INTO cards(card_id, rank, suit) VALUES ( 38,12,'H');
INSERT INTO cards(card_id, rank, suit) VALUES ( 39,13,'H');
INSERT INTO cards(card_id, rank, suit) VALUES ( 40,1,'S');
INSERT INTO cards(card_id, rank, suit) VALUES ( 41,2,'S');
INSERT INTO cards(card_id, rank, suit) VALUES ( 42,3,'S');
INSERT INTO cards(card_id, rank, suit) VALUES ( 43,4,'S');
INSERT INTO cards(card_id, rank, suit) VALUES ( 44,5,'S');
INSERT INTO cards(card_id, rank, suit) VALUES ( 45,6,'S');
INSERT INTO cards(card_id, rank, suit) VALUES ( 46,7,'S');
INSERT INTO cards(card_id, rank, suit) VALUES ( 47,8,'S');
INSERT INTO cards(card_id, rank, suit) VALUES ( 48,9,'S');
INSERT INTO cards(card_id, rank, suit) VALUES ( 49,10,'S');
INSERT INTO cards(card_id, rank, suit) VALUES ( 50,11,'S');
INSERT INTO cards(card_id, rank, suit) VALUES ( 51,12,'S');
INSERT INTO cards(card_id, rank, suit) VALUES ( 52,13,'S');