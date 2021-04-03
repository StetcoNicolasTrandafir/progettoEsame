-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Apr 03, 2021 alle 14:56
-- Versione del server: 10.4.6-MariaDB
-- Versione PHP: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
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
-- Struttura della tabella `categorie`
--

CREATE TABLE `categorie` (
  `idCategoria` int(11) NOT NULL,
  `nomeCategoria` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `categorie`
--

INSERT INTO `categorie` (`idCategoria`, `nomeCategoria`) VALUES
(1, 'Sport'),
(2, 'Politica');

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
(2, 'Chi è il GOAT in NBA?', '2021-04-03 14:14:28', 1, 'T', 6);

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
(1, 1, 5, 'un coglione', '2021-04-03 14:18:01');

-- --------------------------------------------------------

--
-- Struttura della tabella `utenti`
--

CREATE TABLE `utenti` (
  `idUtente` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
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
(6, 'andreoneAbbate', '$2b$10$vt0OinojTB63L', 'andrea', 'abbate', 'andreone.abbate@gmail.com', 'abbate.jpg', '90', 'F', 'ti boccio', '0000-00-00');

--
-- Indici per le tabelle scaricate
--

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
  ADD KEY `categoriaForeignKey` (`categoria`);

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
-- AUTO_INCREMENT per la tabella `categorie`
--
ALTER TABLE `categorie`
  MODIFY `idCategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT per la tabella `domande`
--
ALTER TABLE `domande`
  MODIFY `idDomanda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT per la tabella `messaggi`
--
ALTER TABLE `messaggi`
  MODIFY `idMessaggio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `risposte`
--
ALTER TABLE `risposte`
  MODIFY `idRisposta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT per la tabella `utenti`
--
ALTER TABLE `utenti`
  MODIFY `idUtente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `domande`
--
ALTER TABLE `domande`
  ADD CONSTRAINT `autoreForeignKey` FOREIGN KEY (`autore`) REFERENCES `utenti` (`idUtente`),
  ADD CONSTRAINT `categoriaForeignKey` FOREIGN KEY (`categoria`) REFERENCES `categorie` (`idCategoria`);

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
