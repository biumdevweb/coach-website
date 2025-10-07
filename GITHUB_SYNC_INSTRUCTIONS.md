# Istruzioni per Sync Automatico con GitHub

## Script di Sincronizzazione Automatica

Sono stati creati 3 metodi per sincronizzare automaticamente il tuo sito web con GitHub:

### 1. File Batch Windows (sync-github.bat)

**Come usarlo:**
- Doppio click sul file `sync-github.bat` dalla cartella del progetto
- Oppure eseguilo dal terminale con: `sync-github.bat`

**Caratteristiche:**
- Compatibile con tutte le versioni di Windows
- Interfaccia testuale semplice
- Timestamp automatico nei commit
- Controllo errori integrato

### 2. Script PowerShell (sync-github.ps1)

**Come usarlo:**
- Click destro su `sync-github.ps1` → "Esegui con PowerShell"
- Oppure dal terminale PowerShell: `.\sync-github.ps1`

**Caratteristiche:**
- Output colorato e più leggibile
- Messaggi di stato dettagliati
- Gestione errori migliorata
- Richiede PowerShell 5.0+

### 3. Integrazione VS Code

**Come usarlo in VS Code:**
1. Premi `Ctrl+Shift+P` (o `Cmd+Shift+P` su Mac)
2. Digita "Tasks: Run Task"
3. Seleziona "Sync con GitHub"
4. Oppure usa la scorciatoia `Ctrl+Shift+P` → "Sync con GitHub"

**Caratteristiche:**
- Integrato direttamente nell'editor
- Output nel terminale integrato
- Icona di sync riconoscibile
- Esecuzione rapida

## Cosa Fanno Gli Script

Gli script eseguono automaticamente queste operazioni:

1. **Verifica Git**: Controllano che Git sia installato
2. **Status Repository**: Mostrano lo stato corrente dei file
3. **Add Files**: Aggiungono tutti i file modificati
4. **Commit**: Creano un commit con timestamp automatico
5. **Pull**: Sincronizzano con il repository remoto
6. **Push**: Caricano le modifiche su GitHub

## Prerequisiti

### Git Installato
Assicurati di avere Git installato sul tuo sistema:
- Scarica da: https://git-scm.com/
- Durante l'installazione, mantieni le impostazioni predefinite

### Repository Git Configurato
Il progetto deve essere un repository Git:
```bash
git init
git remote add origin <URL-del-tuo-repo-GitHub>
git branch -M main
```

### Credenziali Git Configurate
Configura le tue credenziali Git:
```bash
git config --global user.name "Il Tuo Nome"
git config --global user.email "la.tua.email@example.com"
```

## Risoluzione Problemi Comuni

### "Git non è installato"
- Installa Git da https://git-scm.com/
- Riavvia il terminale/VS Code dopo l'installazione

### "Questa non è una directory Git"
- Esegui `git init` nella cartella del progetto
- Configura il repository remoto con `git remote add origin <URL>`

### "Push fallito"
- Controlla la connessione internet
- Verifica le tue credenziali GitHub
- Potrebbe essere necessario autenticarsi con GitHub Personal Access Token

### "Pull fallito"
- Ci potrebbero essere conflitti da risolvere
- Gli script continueranno con il push anche se il pull fallisce
- Risolvi i conflitti manualmente se necessario

## Personalizzazione

### Modificare il Branch
Se usi un branch diverso da "main", modifica gli script:
- Nel file `.bat`: cambia `main` con il nome del tuo branch
- Nel file `.ps1`: cambia `main` con il nome del tuo branch

### Modificare il Messaggio di Commit
Puoi personalizzare il formato del timestamp nel messaggio di commit modificando le variabili `timestamp` negli script.

## Sicurezza

- Gli script non memorizzano password
- Usano le credenziali Git già configurate
- È consigliabile usare SSH keys o Personal Access Token per maggiore sicurezza

## Automazione Avanzata

Per esecuzione completamente automatica senza intervento utente:
1. Rimuovi i comandi `pause` dal file `.bat`
2. Rimuovi i comandi `Read-Host` dal file `.ps1`
3. Configura GitHub con SSH keys per evitare inserimento password

## Supporto

Per problemi o domande:
- Controlla l'output degli script per messaggi di errore dettagliati
- Verifica la configurazione Git con `git config --list`
- Assicurati che il repository remoto sia configurato correttamente