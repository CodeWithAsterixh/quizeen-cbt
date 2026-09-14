# Quizeen CBT User Manual

This manual provides operating instructions for exam proctors running the Central Server, educators creating tests in the Assessment Manager, and candidates taking exams in the Student Station.

---

## 1. Exam Proctor Manual (Central Server Application)

The Central Server application serves as the examination hub in the testing hall. It manages student data, stores test definitions, records completed submissions, streams real-time traffic statistics, and broadcasts network discovery beacons across the room.

### 1.1. Starting and Stopping the Server

1. Launch the Quizeen Server application from your desktop shortcut or application folder.
2. In the "Server Control & Network" card, check the port number (default is `4000`).
3. Click "Start Server":
   - If port 4000 is available, the server starts listening on port 4000.
   - If another instance of Queez Server is already running on the computer or network, an informational banner notifies you:
     `Active Queez Server detected at http://127.0.0.1:4000.`
   - If port 4000 is occupied by another software application or restricted by Windows dynamic port reservations, the server automatically finds an open fallback port (such as `4050`, `4100`, or `4500`) and displays:
     `Port 4000 is in use by another app or restricted by Windows. Started on fallback port 4050.`
   - The port input box and active IP address pills update automatically to reflect the running port.
4. To stop the service temporarily, click "Stop Server".

### 1.2. Finding and Sharing Your Server Address

1. Once the server is active, review the list of IP address pills displayed in the control card (for example, `http://192.168.1.150:4000`).
2. Click the "Copy" button next to your primary network IP address to copy the URL to your clipboard.
3. In most networks, you do not need to share this URL manually because the server automatically transmits discovery beacons over UDP port 4001. Student stations and Manager workstations will locate and connect to the server automatically.
4. If network firewall rules block discovery broadcasts, provide the copied URL to proctors so they can type it into the connection settings dialog on client machines.

### 1.3. Configuring Auto-Start

If you want the server to start automatically whenever the computer boots or the app opens:
1. Check the box labeled "Auto-start server when app opens" in the control card.
2. The preference is stored in local configuration. When you open the application in future sessions, the server begins listening immediately on port 4000 (or the first available fallback port).

### 1.4. Navigating the Server Dashboard

The Server GUI navigation sidebar provides three primary views:

1. **Overview Tab**:
   - Displays running state, active port, network IP addresses, and Start/Stop controls.
   - Summarizes active examinees, total tests loaded, and submissions collected.
   - Shows quick instructions for connecting client workstations.
2. **Visual Graph Tab**:
   - Visualizes request volume and response latency over time as an interactive chart.
   - Helps proctors spot connectivity spikes during examination start times or identify network bottlenecks.
3. **Live Requests Tab**:
   - Displays an auto-scrolling log of incoming HTTP requests with real-time badges showing request counts.
   - Each row details the timestamp (with local timezone offset), HTTP method (GET, POST), path, response status code, latency in milliseconds, and client IP address.
   - Routine `/health` check pings are filtered out automatically so the log focuses on real test traffic.
   - Use the search bar to filter logs by endpoint (for example, `/submissions` or `/students`).
   - Click "Export" to download captured logs as a JSON file for archival, or click "Clear" to reset the log display.

### 1.5. Exiting the Application Safely

If you click the window close button while the server is active, a confirmation prompt appears warning that closing the window will terminate the server service and disconnect active examinees. Choose "Keep Server Running" to cancel or "Stop Server & Exit" to shut down.

---

## 2. Educator and Administrator Manual (Assessment Manager Application)

The Assessment Manager application enables teachers, subject heads, and school administrators to create tests, manage student candidate rosters, monitor exams in progress, grade submissions, and analyze class performance.

### 2.1. Connecting to the Central Server

1. Open the Assessment Manager application.
2. Click "Server Connection" at the bottom of the navigation sidebar.
3. If the Central Server is running on the local network, the dialog displays:
   `Discovered server at http://192.168.1.150:4000.`
4. Click "Use Discovered" to connect instantly.
5. If the server is on a different subnet, enter the server URL manually and click "Test Connection" to confirm that the server is reachable.

### 2.2. Creating an Assessment

1. Click "Create Assessment" on the top navigation bar.
2. Under the **Settings and Availability** tab:
   - Enter the subject name (for example, *Biology* or *Mathematics*) and the academic session (for example, *2024/2025*).
   - Select the assessment type: Periodic Test or Major Exam.
   - Choose the educational level: Primary, Junior Secondary, or Senior Secondary.
   - Select the target classes permitted to write this paper (for example, `SSS 2A`, `SSS 2B`).
   - For Senior Secondary, select the department stream if applicable (`Science`, `Arts`, or `Commercial`).
   - Set the duration in minutes and the minimum passing percentage.
   - Set the availability window: toggle the Active switch, and set optional opening date/time and closing deadlines.
   - If desired, set an invigilator unlock PIN (for example, `4321`) to prevent students from starting the test until authorized.
   - Configure anti-cheat randomization:
     - Enable "Shuffle Question Order" so each candidate sees questions in a different sequence.
     - Enable "Shuffle Option Choices" so multiple-choice options are randomized per student.
3. Switch to the **Questions** tab:
   - Click "Add Question" to insert a new question card.
   - Choose the format: Multiple Choice, True/False, or Short Answer.
   - Enter the question prompt using the rich text editor.
   - For Multiple Choice, type option choices, click the radio button next to the correct answer, and assign the point value.
   - Click "Done" on the question card to collapse it into a preview item.
4. Click "Save Assessment" to persist the paper. The assessment syncs directly to the Central Server.

### 2.3. Managing Students and Access Codes

1. Select "Students" from the navigation sidebar.
2. To add a candidate individually:
   - Click "Add Student".
   - Enter the candidate's full name, educational level, class cohort, and department.
   - A unique 6-character alphanumeric code is generated automatically. You can accept it, click "Generate" for another, or type a custom 6-character code.
   - Click "Create Student" to save.
3. To generate codes in batch for an entire class:
   - Click "Generate Codes" to assign codes to all registered students currently lacking access codes.
   - Copy or print the code list to distribute to students on examination day.

### 2.4. Live Monitoring and Marking Submissions

1. Click "Mark Student Answers" in the navigation sidebar.
2. **Live Queue**:
   - Displays all students currently taking assessments in real time.
   - Shows elapsed time and progress through the test.
   - If an examinee switches windows (Alt+Tab or minimizes the kiosk), an alert badge displays the number of recorded window blur infractions.
3. **Marking Queue**:
   - Displays submitted papers ready for scoring.
   - Objective questions are marked automatically by the server.
   - For theory or short-answer questions, review the student's text, assign points, and type optional feedback remarks.
   - Click "Save Grade" to finalize the score.

### 2.5. Offline Package Management (.qzn)

#### Exporting Packages
1. In the assessment list, locate the test you wish to export.
2. Click "Export Package (.qzn)".
3. The application downloads an encrypted archive containing the complete test definition and media. Save this file to a USB flash drive for distribution to air-gapped classrooms.

#### Importing Packages
1. On the dashboard or assessment list, click "Load Package (.qzn)".
2. Select a `.qzn` or `.zip` file from your computer or flash drive.
3. The loader extracts the assessment, marks it active and published, and saves it to the Central Server database.

---

## 3. Student Examination Manual (Student Station Application)

The Student Station application is the candidate test-taking kiosk. It can run as an installed desktop app or inside a web browser.

### 3.1. Connecting to the Examination Server

1. Open the Student Station application.
2. The application listens for UDP discovery beacons and connects to the active server automatically.
3. If the station does not detect a server, click the Settings gear icon in the corner, enter the server address provided by your proctor (for example, `http://192.168.1.150:4000`), and click "Test Connection".

### 3.2. Logging In with Your Student ID Code

Candidates log in using their assigned 6-character access code:
1. Click "Start Exam" or "Enter Exam Room" on the start screen.
2. In the Candidate Exam Login dialog, enter the 6-character Student ID code provided by your teacher (for example, `K7M9P2`).
3. The station automatically checks your code against the Central Server and displays your verified name, class group, and department.
4. Click "Start Assessments" to open your personalized assessment catalog.
5. If you need to switch candidate accounts or leave the station, click "Leave Exam Room" in the top header.

### 3.3. Choosing an Assessment

1. The catalog displays tests scheduled for your class cohort.
2. Locate the paper you are writing.
3. If the paper requires an invigilator PIN, ask your proctor to enter the 4-digit code.
4. Click "Start Assessment" to launch the exam runner.

### 3.4. Taking the Examination

1. **Fullscreen Mode**: The examination opens in fullscreen mode. Keep this window open and focused throughout the exam.
2. **Countdown Timer**: A timer at the top counts down your remaining time. When the timer reaches 0:00, your answers submit automatically.
3. **Question Navigation**:
   - Click "Next" and "Previous" to step through questions.
   - Use the question index grid to jump directly to any question.
   - Answered questions appear highlighted in the grid.
4. **Scientific Calculator**:
   - For science and mathematics tests, click the Calculator button to open an on-screen scientific calculator.
5. **Anti-Cheat Rules**:
   - Do not press Alt+Tab, do not press the Windows key, and do not click outside the exam window.
   - Leaving the exam window triggers an on-screen warning and records an infraction on your test record. Proctors can see these infractions in real time.
6. **Local Answer Preservation**:
   - Your answers save automatically on your computer. If the network disconnects temporarily during the test, continue answering questions normally.

### 3.5. Submitting Your Assessment

1. Once you have answered all questions, click "Submit Assessment".
2. Review the confirmation dialog showing your total answered questions.
3. Click "Confirm Submit".
4. If results are published immediately, your final score and percentage appear on screen. Otherwise, a confirmation message indicates that your submission was received and is awaiting teacher marking.
5. Click "Return to Catalog" to finish. Completed assessments display an "Already Submitted" badge and cannot be reopened.
