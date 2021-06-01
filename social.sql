-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Giu 01, 2021 alle 19:21
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
(6, 'Tecnologia', '#0032d5'),
(7, 'Libri', '#e6b329');

-- --------------------------------------------------------

--
-- Struttura della tabella `domande`
--

CREATE TABLE `domande` (
  `idDomanda` int(11) NOT NULL,
  `testoDomanda` varchar(250) NOT NULL,
  `data` datetime NOT NULL,
  `categoria` int(11) NOT NULL,
  `disponibile` char(1) NOT NULL,
  `autore` int(11) NOT NULL,
  `iv` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `domande`
--

INSERT INTO `domande` (`idDomanda`, `testoDomanda`, `data`, `categoria`, `disponibile`, `autore`, `iv`) VALUES
(2, 'f4cca3f75dc061f02eb09a93b7691b728d8487c5f4c657321b', '2021-05-28 15:47:41', 4, 'T', 11, '426c22b9424b06bea24533333dabdd7a'),
(3, 'a66e3746b55e1529a65e29e9e7533bf417c955024b449254c4db9e3c15c1970150c0133024b062416b42972b31d534', '2021-05-28 15:49:08', 5, 'T', 11, 'd95387c53bd33e9553c178d8a6e6f786'),
(4, '455434be9adaf5fcc61bcc7e10158a2adbd636e1a8feacfa9d98c11877b122', '2021-05-28 17:34:17', 2, 'T', 40, 'e7d994bfec9933124984a6c36f698b26'),
(5, 'e24fbbc09cb3fa8044d241d6534174cbe2f8fa75cb', '2021-06-01 11:37:26', 6, 'T', 11, 'bd68a9a623de635b5fd6e27f04ca5ce1'),
(6, 'fe5fbdc090fc19690adf5f994e503b84b1e1da54800944059ab35b1d3b8cb58e', '2021-06-01 11:38:14', 1, 'T', 11, 'bd68a9a623de635b5fd6e27f04ca5ce1'),
(7, '7d526f52e970edac93471c9b9a6acab12e112cb76cac7712e3d7dfc291eea58caa0bc17dbdad2f8a7548f637a42e54', '2021-06-01 11:44:36', 7, 'T', 40, '7bee99e117f0620596b32e4b763cedf8'),
(8, '6cd315bd905f61db9bd4dfa0babfbba51a68b4a760346ac5fb37d7d2240c6c687447ae9ad409e31023b51bc419', '2021-06-01 11:58:34', 3, 'T', 11, 'c99680ff72113aabe4c236b79b7b12de');

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
(24, 11, 41, 'T', '2021-06-01 09:36:04'),
(25, 11, 40, 'T', '2021-06-01 09:36:04');

-- --------------------------------------------------------

--
-- Struttura della tabella `messaggi`
--

CREATE TABLE `messaggi` (
  `idMessaggio` int(11) NOT NULL,
  `testoMessaggio` varchar(500) NOT NULL,
  `data` datetime NOT NULL,
  `mittente` int(11) NOT NULL,
  `destinatario` int(11) NOT NULL,
  `iv` varchar(50) NOT NULL,
  `letto` char(1) NOT NULL DEFAULT 'F'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `messaggi`
--

INSERT INTO `messaggi` (`idMessaggio`, `testoMessaggio`, `data`, `mittente`, `destinatario`, `iv`, `letto`) VALUES
(14, '9b75e26f2203399ab13eca480d3b9c4f103353847dc99d16c90ea312d0b19647cbb61d0eb24eb04d0e35745e6062e9', '2021-05-28 17:48:30', 11, 40, '32df13bf3b448efbcf5e906228df19aa', 'T'),
(15, '8c69ef6633039512d73ed500', '2021-05-28 17:48:40', 40, 11, '32df13bf3b448efbcf5e906228df19aa', 'T'),
(16, '8c69ef6633039512d73ed500', '2021-05-28 17:48:50', 40, 11, '32df13bf3b448efbcf5e906228df19aa', 'T'),
(17, '328ffa66', '2021-06-01 09:19:40', 11, 40, '4ee5986207d942c19c73320128257360', 'T'),
(18, '7bc61b41e730d3cddc4e6afe21ff13a9ba6b252dc9d00fe055', '2021-06-01 09:37:31', 11, 41, 'c07f112b411f10226515f746a37118e9', 'F'),
(19, '6cfa2868cc4a55', '2021-06-01 09:37:32', 41, 11, 'c07f112b411f10226515f746a37118e9', 'T'),
(20, '42e22a4886', '2021-06-01 09:43:53', 11, 40, 'ead2b561cd434a8b15b058e186a661cb', 'T'),
(21, '9c46de7ffe4a20e07354', '2021-06-01 10:42:42', 40, 11, 'b5f4e184494134f2f72270d9a51fe3f4', 'T'),
(22, '621f5da9dab5d798a4', '2021-06-01 11:04:41', 11, 40, '50d79da7267de35d663f02acf93d790e', 'T'),
(23, '750544b895e3d4c2c07425bb6f2d', '2021-06-01 11:09:15', 40, 11, '50d79da7267de35d663f02acf93d790e', 'T'),
(24, '72045fec96a2c0c8dc706bab7532671b6226f45ca74674b43c', '2021-06-01 11:09:29', 40, 11, '50d79da7267de35d663f02acf93d790e', 'T');

-- --------------------------------------------------------

--
-- Struttura della tabella `risposte`
--

CREATE TABLE `risposte` (
  `idRisposta` int(11) NOT NULL,
  `domanda` int(11) NOT NULL,
  `utente` int(11) NOT NULL,
  `testoRisposta` varchar(250) NOT NULL,
  `data` datetime NOT NULL,
  `stato` char(1) NOT NULL DEFAULT 'S',
  `iv` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `risposte`
--

INSERT INTO `risposte` (`idRisposta`, `domanda`, `utente`, `testoRisposta`, `data`, `stato`, `iv`) VALUES
(1, 3, 40, 'c585277692674b8f43fd', '2021-05-28 15:50:46', 'A', '5273f3332cfed0094383862d6a7f4284'),
(2, 3, 40, '7a3e4686d7c0', '2021-05-28 16:05:34', 'A', 'c591b560104dc768d96c8777b0c88813'),
(3, 3, 40, '8bcf4f1974b0', '2021-05-28 16:07:09', 'A', '40da075e0b2c0a4fe6937f4550515db2'),
(4, 4, 11, 'bca8b05363891417dc1484f62b', '2021-05-28 17:45:05', 'A', '1d62a7beacd16cf0a40c344b278a5d1e'),
(5, 3, 40, '8c69ef6633039512d73ed500', '2021-05-28 17:48:12', 'A', '32df13bf3b448efbcf5e906228df19aa'),
(6, 3, 40, '7dc1a2691331f6323e', '2021-06-01 09:10:04', 'S', '18f3bee7eafd66e051c6c0c488756297'),
(7, 2, 40, '46c2ef6b', '2021-06-01 09:10:09', 'S', '18f3bee7eafd66e051c6c0c488756297'),
(8, 2, 40, '62c8ec6f1b31e4', '2021-06-01 09:10:15', 'S', '18f3bee7eafd66e051c6c0c488756297'),
(9, 2, 41, '7b5ba12c753b97', '2021-06-01 09:34:11', 'A', '6722ad065f9f7a57705cad916591fd71'),
(10, 6, 40, '654b2e5ced234561c7', '2021-06-01 11:44:06', 'S', '7bee99e117f0620596b32e4b763cedf8'),
(11, 7, 11, '66d058b5d9432838509cdaa0f7b8fab80227b6a7c2ad2ec7ee3ad0962042616a615fa8', '2021-06-01 11:54:06', 'S', 'c99680ff72113aabe4c236b79b7b12de');

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
(11, 'pinguino', '$2b$10$OFJuHwj2W3iugK9r7wZROOJJe7ZWAFcddn83.C68G4i68idJlYVBu', 'Pippo', 'Baudo', 'pinguino@gmail.com', 'jpeg', '44.6999000;8.0347000', 'F', 'Ciao mi chiamo Andrea Tomatis', '2002-04-02'),
(40, 'stetconicolas', '$2b$10$toEkPYsWNIOrqmLLxmj82uLLKYTD5AfPWFFHo7PvG6dQ1IsM7PNu2', 'Nicolas', 'Stetco', 'stetconicolas@gmail.com', 'jpg', '44.5058388;7.7215659', 'M', 'Mi piace programmare', '2021-05-28'),
(41, 'iamdias', '$2b$10$luUIOmCGV5OcH5Z74KNV/eS7wPZXhoHHc4bc6TSMBz5ltIxMRk0qe', 'Andrea', 'Tomatis', 'andreatomatis02.at@gmail.com', 'jpg', '44.5609089;7.7308176', 'M', 'Sono un figo', '1994-06-01');

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
  MODIFY `idCategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT per la tabella `domande`
--
ALTER TABLE `domande`
  MODIFY `idDomanda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT per la tabella `matched`
--
ALTER TABLE `matched`
  MODIFY `matchedId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT per la tabella `messaggi`
--
ALTER TABLE `messaggi`
  MODIFY `idMessaggio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT per la tabella `risposte`
--
ALTER TABLE `risposte`
  MODIFY `idRisposta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT per la tabella `utenti`
--
ALTER TABLE `utenti`
  MODIFY `idUtente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

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
