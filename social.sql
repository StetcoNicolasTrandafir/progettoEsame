-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Mag 10, 2021 alle 14:28
-- Versione del server: 10.4.14-MariaDB
-- Versione PHP: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `social`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `blacklist`
--

CREATE TABLE `blacklist` (
  `idBlacklist` int(11) NOT NULL,
  `idUtente` int(11) NOT NULL,
  `idCategoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `categorie`
--

CREATE TABLE `categorie` (
  `idCategoria` int(11) NOT NULL,
  `nomeCategoria` varchar(30) NOT NULL,
  `colore` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `categorie`
--

INSERT INTO `categorie` (`idCategoria`, `nomeCategoria`, `colore`) VALUES
(1, 'Sport', '#f00'),
(2, 'Politica', '#0f0'),
(3, 'Divertenti', '#ffff00'),
(4, 'Viaggi', '#ffea00'),
(5, 'Cibo', '#cf8900'),
(6, 'Tecnologia', '#0032d5');

-- --------------------------------------------------------

--
-- Struttura della tabella `domande`
--

CREATE TABLE `domande` (
  `idDomanda` int(11) NOT NULL,
  `testoDomanda` varchar(50) NOT NULL,
  `data` datetime NOT NULL,
  `categoria` int(11) NOT NULL,
  `disponibile` char(1) NOT NULL,
  `autore` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `domande`
--

INSERT INTO `domande` (`idDomanda`, `testoDomanda`, `data`, `categoria`, `disponibile`, `autore`) VALUES
(1, 'Cosa ne pensi di Bettino Craxi?', '0000-00-00 00:00:00', 2, 'T', 5),
(2, 'Chi è il GOAT in NBA?', '2021-04-03 14:14:28', 1, 'T', 6),
(3, 'quanti anni hai?', '2021-04-20 10:48:25', 1, 'T', 8),
(4, 'Adamo ed Eva avevano l\'ombelico?', '0000-00-00 00:00:00', 3, 'T', 11),
(5, 'Adamo ed Eva avevano l\'ombelico?', '2021-04-03 14:14:28', 3, 'T', 11),
(6, 'Quale è il tuo panino del Mc Donald preferito?', '2021-04-03 14:14:28', 5, 'T', 12),
(7, 'L\'intelligenza artificiale conquisterà il mondo?', '2021-04-03 14:14:28', 6, 'T', 9),
(8, 'Quale è l\'ultima città che hai visitato?', '2021-04-03 14:14:28', 4, 'T', 5),
(9, 'Quanto ti manca Giuseppe Conte?', '2021-04-03 14:14:28', 2, 'T', 5),
(10, 'Quale è la tua città preferita?', '2021-04-03 14:14:28', 4, 'T', 15),
(11, 'Meglio Android o iOS?', '2021-04-03 14:14:28', 6, 'T', 14),
(12, 'Perché è importante fare sport?', '2021-04-03 14:14:28', 1, 'T', 9);

-- --------------------------------------------------------

--
-- Struttura della tabella `matched`
--

CREATE TABLE `matched` (
  `matchedId` int(11) NOT NULL,
  `idUtenteDomanda` int(11) NOT NULL,
  `idUtenteRisposta` int(11) NOT NULL,
  `matched` char(1) NOT NULL,
  `data` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `matched`
--

INSERT INTO `matched` (`matchedId`, `idUtenteDomanda`, `idUtenteRisposta`, `matched`, `data`) VALUES
(1, 11, 12, 'T', '2021-04-03 00:00:00'),
(2, 12, 11, 'T', '2021-04-03 14:14:28'),
(3, 11, 12, 'F', '2021-04-03 14:14:28'),
(4, 11, 15, 'F', '2021-04-03 14:14:28');

-- --------------------------------------------------------

--
-- Struttura della tabella `messaggi`
--

CREATE TABLE `messaggi` (
  `idMessaggio` int(11) NOT NULL,
  `testoMessaggio` varchar(500) NOT NULL,
  `data` datetime NOT NULL,
  `mittente` int(11) NOT NULL,
  `destinatario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `messaggi`
--

INSERT INTO `messaggi` (`idMessaggio`, `testoMessaggio`, `data`, `mittente`, `destinatario`) VALUES
(1, 'undefined', '2021-04-17 10:37:41', 8, 6),
(2, 'undefined', '2021-04-17 10:38:17', 8, 6),
(3, 'ciao', '2021-04-17 10:38:52', 8, 6),
(4, 'ciao', '2021-04-20 10:47:47', 8, 6);

-- --------------------------------------------------------

--
-- Struttura della tabella `risposte`
--

CREATE TABLE `risposte` (
  `idRisposta` int(11) NOT NULL,
  `domanda` int(11) NOT NULL,
  `utente` int(11) NOT NULL,
  `testoRisposta` varchar(250) NOT NULL,
  `data` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `risposte`
--

INSERT INTO `risposte` (`idRisposta`, `domanda`, `utente`, `testoRisposta`, `data`) VALUES
(1, 1, 5, 'un coglione', '2021-04-03 14:18:01'),
(2, 2, 8, 'ne ho venti', '2021-04-20 10:48:08'),
(3, 2, 11, 'Chi è il GOAT in NBA?', '2021-05-07 17:31:12'),
(4, 2, 11, 'IO', '2021-05-07 17:32:22'),
(5, 2, 11, 'xcxc', '2021-05-07 17:41:37'),
(6, 2, 11, 'Pippo', '2021-05-07 22:12:53'),
(7, 3, 11, '19', '2021-05-08 08:23:43'),
(8, 2, 11, 'IO', '2021-05-08 08:24:48'),
(9, 2, 11, 'IO', '2021-05-08 08:28:38'),
(10, 2, 11, 'IO', '2021-05-08 08:29:40'),
(11, 2, 11, 'dsfsdf', '2021-05-08 08:31:51'),
(12, 7, 11, 'Sì di sicuro', '2021-05-09 10:32:30');

-- --------------------------------------------------------

--
-- Struttura della tabella `utenti`
--

CREATE TABLE `utenti` (
  `idUtente` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `nome` varchar(30) NOT NULL,
  `cognome` varchar(30) NOT NULL,
  `mail` varchar(30) NOT NULL,
  `foto` varchar(100) NOT NULL,
  `posizione` varchar(200) NOT NULL,
  `sesso` char(1) NOT NULL,
  `descrizione` varchar(300) NOT NULL,
  `dataNascita` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `utenti`
--

INSERT INTO `utenti` (`idUtente`, `username`, `password`, `nome`, `cognome`, `mail`, `foto`, `posizione`, `sesso`, `descrizione`, `dataNascita`) VALUES
(4, 'abbateeeee', '$2b$10$7pi1cpBAyTXBQ', 'andrea', 'abbate', 'abbate@gmail.com', 'abbate.jpg', '90', 'F', 'ti boccio', '0000-00-00'),
(5, 'andreaAbbate', '$2b$10$L1PcpBjzHbGOy', 'andrea', 'abbate', 'andrea.abbate@gmail.com', 'abbate.jpg', '90', 'F', 'ti boccio', '0000-00-00'),
(6, 'andreoneAbbate', '$2b$10$vt0OinojTB63L', 'andrea', 'abbate', 'andreone.abbate@gmail.com', 'abbate.jpg', '90', 'F', 'ti boccio', '0000-00-00'),
(8, 'dias', '$2b$10$ziqW1UBmvNezwFXRetIS0uC5Y/9/iHmTWduUQ6OYK37n7QKdKQbyK', 'pippo', 'baudo', 'dias@gmail.com', 'ciao.png', 'uashdadasahdasdjjasod', 'F', 'ciaociaociao', '2002-04-02'),
(9, 'arancino', '$2b$10$2VinocaG8GrY25FZ.RSzAu3MiWPdpEmNEUvFbrRQ.EaTF5G1SuUoK', 'pippo', 'baudo', 'diasilGrande@gmail.com', 'ciao.png', 'uashdadasahdasdjjasod', 'F', 'ciaociaociao', '2002-04-02'),
(10, 'arancina', '$2b$10$0USDzXyvvpM3pViWkaViZ.NoN/ZZrxMNLjlOHcox/pH56OaGTDMQW', 'pippo', 'baudo', 'arancina@gmail.com', 'ciao.png', 'uashdadasahdasdjjasod', 'F', 'ciaociaociao', '2002-04-02'),
(11, 'pengu', '$2b$10$8CMgJG2LbhgWWl4v73EuGuw/OYsEWsZg1XI0F75VtuzaWw5ejqs7m', 'pippo', 'baudo', 'pengu@gmail.com', 'ciao.png', 'uashdadasahdasdjjasod', 'F', 'ciaociaociao', '2002-04-02'),
(12, 'iamdias', '$2b$10$MasbrqtYeQkpATuQHU1.Pewrn3IQVjnb27V0b2eo2YTh7dWprbMki', 'Andrea', 'Tomatis', 'andreatomatis02.at@gmail.com', 'avatar.svg', '10;10', 'M', 'Sono un figo', '2002-04-02'),
(13, 'iamdiasb', '$2b$10$fF8DnbR.lvpO2WRoGg0hY.Y5sklqaLj2nsEWLW/Ftj8Fuz2GbYmhG', 'Andrea', 'Tomatis', 'andreatomcxatis02.at@gmail.com', 'avatar.svg', '40.1208752;9.012892599999999', 'M', 'Sono un figo', '2021-05-05'),
(14, 'iamdiascvvc', '$2b$10$vLb60JlbptztXaboGObBEeh19ACbADatOyYLp6SFFPAOhbz0usEEO', 'Andrea', 'Tomatis', 'andreatomatisvcv02.at@gmail.co', 'avatar.svg', '40.1208752;9.012892599999999', 'M', 'Sono un figo', '2021-05-05'),
(15, 'iamdiasxc', '$2b$10$1pQMsc8UkM5a5la4xaOEZ.uhf9aAffDWv5Ymrig9rAjclAkhg1SRO', 'Andrea', 'Tomatis', 'andreatocxvmatis02.at@gmail.co', 'scansione0001.jpg', '44.504711799999995;7.7308176', 'M', 'Sono un figo', '2021-05-07');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `blacklist`
--
ALTER TABLE `blacklist`
  ADD PRIMARY KEY (`idBlacklist`),
  ADD KEY `idUtente` (`idUtente`),
  ADD KEY `idCategoria` (`idCategoria`);

--
-- Indici per le tabelle `categorie`
--
ALTER TABLE `categorie`
  ADD PRIMARY KEY (`idCategoria`);

--
-- Indici per le tabelle `domande`
--
ALTER TABLE `domande`
  ADD PRIMARY KEY (`idDomanda`),
  ADD KEY `autoreForeignKey` (`autore`),
  ADD KEY `categoriaForeignKey` (`categoria`),
  ADD KEY `categoria` (`categoria`);

--
-- Indici per le tabelle `matched`
--
ALTER TABLE `matched`
  ADD PRIMARY KEY (`matchedId`),
  ADD KEY `idUtenteRisposta` (`idUtenteRisposta`),
  ADD KEY `idUtenteDomanda` (`idUtenteDomanda`);

--
-- Indici per le tabelle `messaggi`
--
ALTER TABLE `messaggi`
  ADD PRIMARY KEY (`idMessaggio`),
  ADD KEY `mittenteForeignKey` (`mittente`),
  ADD KEY `destinatarioForeignKey` (`destinatario`);

--
-- Indici per le tabelle `risposte`
--
ALTER TABLE `risposte`
  ADD PRIMARY KEY (`idRisposta`),
  ADD KEY `autoreRispostaForeignKey` (`utente`),
  ADD KEY `domandaForeignKey` (`domanda`);

--
-- Indici per le tabelle `utenti`
--
ALTER TABLE `utenti`
  ADD PRIMARY KEY (`idUtente`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `blacklist`
--
ALTER TABLE `blacklist`
  MODIFY `idBlacklist` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT per la tabella `categorie`
--
ALTER TABLE `categorie`
  MODIFY `idCategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT per la tabella `domande`
--
ALTER TABLE `domande`
  MODIFY `idDomanda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT per la tabella `matched`
--
ALTER TABLE `matched`
  MODIFY `matchedId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `messaggi`
--
ALTER TABLE `messaggi`
  MODIFY `idMessaggio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `risposte`
--
ALTER TABLE `risposte`
  MODIFY `idRisposta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT per la tabella `utenti`
--
ALTER TABLE `utenti`
  MODIFY `idUtente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `blacklist`
--
ALTER TABLE `blacklist`
  ADD CONSTRAINT `blacklist_ibfk_1` FOREIGN KEY (`idUtente`) REFERENCES `utenti` (`idUtente`),
  ADD CONSTRAINT `blacklist_ibfk_2` FOREIGN KEY (`idCategoria`) REFERENCES `categorie` (`idCategoria`);

--
-- Limiti per la tabella `domande`
--
ALTER TABLE `domande`
  ADD CONSTRAINT `autoreForeignKey` FOREIGN KEY (`autore`) REFERENCES `utenti` (`idUtente`),
  ADD CONSTRAINT `categoriaForeignKey` FOREIGN KEY (`categoria`) REFERENCES `categorie` (`idCategoria`);

--
-- Limiti per la tabella `matched`
--
ALTER TABLE `matched`
  ADD CONSTRAINT `matched_ibfk_1` FOREIGN KEY (`idUtenteRisposta`) REFERENCES `utenti` (`idUtente`),
  ADD CONSTRAINT `matched_ibfk_2` FOREIGN KEY (`idUtenteDomanda`) REFERENCES `utenti` (`idUtente`);

--
-- Limiti per la tabella `messaggi`
--
ALTER TABLE `messaggi`
  ADD CONSTRAINT `destinatarioForeignKey` FOREIGN KEY (`destinatario`) REFERENCES `utenti` (`idUtente`),
  ADD CONSTRAINT `mittenteForeignKey` FOREIGN KEY (`mittente`) REFERENCES `utenti` (`idUtente`);

--
-- Limiti per la tabella `risposte`
--
ALTER TABLE `risposte`
  ADD CONSTRAINT `autoreRispostaForeignKey` FOREIGN KEY (`utente`) REFERENCES `utenti` (`idUtente`),
  ADD CONSTRAINT `domandaForeignKey` FOREIGN KEY (`domanda`) REFERENCES `domande` (`idDomanda`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
