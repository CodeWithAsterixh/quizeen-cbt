# Quizeen CBT user manual

This manual provides instructions for educators authoring tests, exam proctors managing local servers, and students sitting for examinations using the Quizeen Computer-Based Testing platform.

---

## Exam proctor manual (Server app)

The Server application acts as the local examination hub. It hosts tests, collects submissions, provides real-time traffic monitoring, and broadcasts network discovery beacons across the examination room.

### Starting and stopping the server

1. Open the Quizeen Server application.
2. In the "Server Control & Network" card, verify the port number (default is 4000).
3. Select "Start Server" to begin listening for examination traffic. The status badge will change to "Active (Listening)".
4. Select "Stop Server" to temporarily pause network traffic.

### Configuring auto-start

If you want the server to launch automatically every time you open the application, enable the "Auto-start server when app opens" checkbox under the server control card. Leave this unchecked if you prefer to start the server manually for each exam session.

### Finding your server network address

The server automatically scans your computer network adapters and lists all available IP addresses:
1. Locate the IP address list in the server control card (for example, `http://192.168.1.150:4000`).
2. Select "Copy" next to the primary LAN IP address to copy the URL to your clipboard.
3. Share this address with test candidates or rely on the automatic zero-configuration discovery built into the Student and Manager apps.

### Navigating the server dashboard

The Server GUI provides a navigation sidebar with three primary views:

1. **Overview tab**:
   - Contains server status, port controls, and Start/Stop actions.
   - Shows active local IP addresses with copy buttons.
   - Includes the auto-start toggle and quick status summary.
2. **Visual Graph tab**:
   - Visualizes request latency and traffic frequency over time as an interactive chart.
   - Helps proctors spot connectivity slowdowns or traffic spikes during peak exam start times.
3. **Live tab (Live requests)**:
   - Displays an auto-scrolling log of incoming HTTP requests with real-time badges showing request counts.
   - Shows timestamp, HTTP method (GET, POST), path, status code, latency in milliseconds, and client IP address.
   - Provides a search bar to filter logs by endpoint (for example, `/submissions` or `/assessments`).
   - Includes "Export" to download captured logs as a JSON file and "Clear" to reset the log display.

### Exiting the application safely

If you click the window close button while the server is actively running, a confirmation prompt appears warning that closing the window will stop the server and disconnect active student sessions. Select "Keep Server Running" to cancel or "Stop Server & Exit" to proceed.

---

## Educator and administrator manual (Manager app)

The Manager application enables teachers and administrators to create tests, manage schedules, compile offline packages, and review class performance.

### Connecting to the central server

1. Open the Manager application.
2. Select "Server Connection" at the bottom of the navigation sidebar.
3. If the Server app is running on the same network, a banner displays "Discovered server". Select "Use Discovered" to connect automatically.
4. Alternatively, enter the server URL manually and select "Test Connection" to confirm availability.

### Creating an assessment

1. Select the "Create Assessment" button from the top navigation bar.
2. In the "Settings and Availability" tab:
   - Enter the subject name (for example, Mathematics or Biology) and academic session (for example, 2024/2025).
   - Select the assessment type: Periodic Test or Major Exam.
   - Choose the education level: Primary, Junior Secondary, or Senior Secondary.
   - Select the target classes permitted to take this test (for example, SSS 2, SSS 3).
   - For Senior Secondary, select the department stream if applicable (Science, Arts, or Commercial).
   - Set the duration in minutes and the minimum passing score percentage.
   - Configure availability: enable the Active status toggle and set optional start or deadline timestamps.
3. Switch to the "Questions" tab:
   - Select "Add Question" to create a new question.
   - Choose the question format (Multiple Choice, True/False, or Short Answer).
   - Enter the question text and answer options.
   - Mark the correct answer option.
   - Select "Done" on the question card to collapse it into a preview item.
4. Select "Save Assessment" to finalize the paper.

### Managing students and generating student IDs

1. Select "Students" from the navigation sidebar.
2. Select "Add Student".
3. In the single-stage creation modal:
   - Enter the student full name.
   - A unique 6-character alphanumeric ID is generated automatically. You can select "Generate" to create a new code or type a custom 6-character code.
   - Toggle the education level: Primary, Junior Secondary, or Senior Secondary.
   - Toggle the student's class group.
   - For Senior Secondary, toggle the department stream (Science, Arts, or Commercial).
4. Select "Create Student" to save the candidate account.
5. Use the copy button next to any student ID in the list to distribute the code to the candidate.

### Exporting assessments for offline exam rooms (.qzn)

1. Select "Compile Assessments" from the navigation menu.
2. Choose the assessments to bundle into the package.
3. Set examination date and time windows for each paper.
4. Select "Export .qzn Package" and save the file to a USB flash drive for offline rooms.

---

## Candidate and student manual (Student portal)

The Student portal provides a clean interface for entering your student ID, selecting papers, and completing assessments.

### Server connection and auto-discovery

Candidate computers connected to the same local area network as the Server will automatically discover the server. To review or change the connection:
1. From the start screen, select "Settings".
2. Enter supervisor credentials if prompted.
3. Review the "Network Server Connection" card. If an active server is detected, select "Connect" to link directly to the teacher's station.

### Taking an assessment

1. Open the Quizeen Student application.
2. Select "Enter Student ID".
3. Enter your 6-character Student ID code in the OTP-style input boxes. The code is case-insensitive and can be typed or pasted.
4. When verified, your name, class, and department stream are confirmed. Select "Start Assessments".
5. Review the list of available assessments filtered for your class and department stream.
5. Select "Start Test" or "Start Exam" on the desired assessment. If the test requires an invigilator PIN, enter the code provided by your teacher.
6. Read each question carefully. Use the question grid buttons to jump between questions.
7. Open the built-in calculator from the side menu if you need to perform calculations.
8. When finished, select "Submit Assessment" and confirm your submission.

### Leaving the exam room

If you need to change your name, class, or department, select the "Leave Exam Room" button in the upper corner of the catalog view. This clears the current student session and returns you to the initial start screen.

---

## Frequently asked questions and troubleshooting

### What happens if a computer shuts down or loses power during a test?

The student application saves your answers locally as you answer each question. When you reopen the application on the same computer, your answers and remaining time are restored.

### Why is an assessment not visible in the student catalog?

Check the following settings in the Manager app:
1. Ensure the assessment is set to Active under Availability.
2. Check that the current date and time fall within the scheduled start and deadline times.
3. Verify that the student registered with the exact class group and education level targeted by the assessment.

### Can a student retake an assessment that has already been submitted?

No. Once an assessment has been submitted, its status updates to "Already Submitted" and the start button is disabled to prevent repeated attempts.
