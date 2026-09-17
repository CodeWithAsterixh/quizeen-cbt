; ==============================================================================
; Queez CBT Suite - Unified Multi-Stage Setup Script
; ==============================================================================

Unicode true
SetCompressor /FINAL zlib

!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "FileFunc.nsh"
!include "nsDialogs.nsh"

!insertmacro GetParameters
!insertmacro GetOptions

; Installation scope variables
Var DialogInstallScope
Var RadioAllUsers
Var RadioCurrentUser
Var InstallScope
Var Relaunched

; Define defaults if not passed via command line
!ifndef VERSION
  !define VERSION "2.0.6"
!endif
!ifndef ICON_PATH
  !define ICON_PATH "..\apps\manager\resources\icon.ico"
!endif
!ifndef LICENSE_PATH
  !define LICENSE_PATH "LICENSE.txt"
!endif
!ifndef OUT_FILE
  !define OUT_FILE "Queez-CBT-Suite-Setup-v${VERSION}.exe"
!endif
!ifndef SERVER_DIR
  !define SERVER_DIR "..\apps\server\release\win-unpacked"
!endif
!ifndef MANAGER_DIR
  !define MANAGER_DIR "..\apps\manager\release\win-unpacked"
!endif
!ifndef STUDENT_DIR
  !define STUDENT_DIR "..\apps\student\release\win-unpacked"
!endif
!ifndef SUITE_NAME
  !define SUITE_NAME "Queez CBT Suite"
!endif
!ifndef BRANDING_TEXT
  !define BRANDING_TEXT "Quizeen CBT Systems"
!endif
!ifndef STUDENT_NAME
  !define STUDENT_NAME "Queez Student Portal"
!endif
!ifndef MANAGER_NAME
  !define MANAGER_NAME "Queez Assessment Manager"
!endif
!ifndef SERVER_NAME
  !define SERVER_NAME "Queez Local Server"
!endif

Name "${SUITE_NAME} ${VERSION}"
OutFile "${OUT_FILE}"
InstallDir "$LOCALAPPDATA\Programs\${SUITE_NAME}"
RequestExecutionLevel user

BrandingText "${BRANDING_TEXT}"

; Installer visuals
!define MUI_ICON "${ICON_PATH}"
!define MUI_UNICON "${ICON_PATH}"
!define MUI_ABORTWARNING

; ------------------------------------------------------------------------------
; Wizard Pages
; ------------------------------------------------------------------------------

Function SkipIfRelaunched
  ${If} $Relaunched == 1
    Abort
  ${EndIf}
FunctionEnd

; Page 1: Welcome
!define MUI_PAGE_CUSTOMFUNCTION_PRE SkipIfRelaunched
!define MUI_WELCOMEPAGE_TITLE "Welcome to ${SUITE_NAME} Setup"
!define MUI_WELCOMEPAGE_TEXT "This setup wizard will install the ${SUITE_NAME} on your computer.$\r$\n$\r$\n${SUITE_NAME} is an offline assessment suite built for schools and examination centers, connecting local database servers, teacher management tools, and student test terminals.$\r$\n$\r$\nClick Next to continue."
!insertmacro MUI_PAGE_WELCOME

; Page 2: License Agreement
!define MUI_PAGE_CUSTOMFUNCTION_PRE SkipIfRelaunched
!define MUI_LICENSEPAGE_CHECKBOX
!define MUI_LICENSEPAGE_TEXT_TOP "Please review the license terms before proceeding. You must accept these terms to install ${SUITE_NAME}."
!define MUI_LICENSEPAGE_TEXT_BOTTOM "If you accept the terms of the agreement, select the checkbox below and click Next."
!insertmacro MUI_PAGE_LICENSE "${LICENSE_PATH}"

; Page 3: Installation Scope (All Users vs Current User)
Page custom PageInstallScopeShow PageInstallScopeLeave

; Page 4: Component Selection
InstType "Full Suite (Server, Manager and Student)"
InstType "Admin Workstation (Server and Manager)"
InstType "Student Lab Station (Student Portal Only)"

!define MUI_COMPONENTSPAGE_TEXT_TOP "Choose which ${SUITE_NAME} applications to install based on this computer's role:"
!define MUI_COMPONENTSPAGE_TEXT_COMPLIST "Available Applications:"
!insertmacro MUI_PAGE_COMPONENTS

; Page 4: Install Location
!define MUI_DIRECTORYPAGE_TEXT_TOP "Setup will install ${SUITE_NAME} in the following folder. To install in a different folder, click Browse and select another folder."
!insertmacro MUI_PAGE_DIRECTORY

; Page 5: Start Menu Folder
Var STARTMENU_FOLDER
!define MUI_STARTMENUPAGE_REGISTRY_ROOT "HKCU"
!define MUI_STARTMENUPAGE_REGISTRY_KEY "Software\${BRANDING_TEXT}\${SUITE_NAME}"
!define MUI_STARTMENUPAGE_REGISTRY_VALUENAME "Start Menu Folder"
!define MUI_STARTMENUPAGE_DEFAULTFOLDER "${SUITE_NAME}"
!insertmacro MUI_PAGE_STARTMENU Application $STARTMENU_FOLDER

; Page 6: Progress
!insertmacro MUI_PAGE_INSTFILES

; Page 7: Finish
!define MUI_FINISHPAGE_TITLE "Installation Finished"
!define MUI_FINISHPAGE_TEXT "${SUITE_NAME} has been installed successfully.$\r$\n$\r$\nYour applications are ready to use in the Start Menu under the ${SUITE_NAME} folder."
!define MUI_FINISHPAGE_RUN
!define MUI_FINISHPAGE_RUN_TEXT "Open ${MANAGER_NAME}"
!define MUI_FINISHPAGE_RUN_FUNCTION "LaunchManager"
!insertmacro MUI_PAGE_FINISH

; Uninstaller Pages
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

; ------------------------------------------------------------------------------
; Component Sections
; ------------------------------------------------------------------------------

Section "${SERVER_NAME}" SecServer
  SectionIn 1 2
  SetOutPath "$INSTDIR\Server"
  File /r "${SERVER_DIR}\*.*"
  CreateDirectory "$INSTDIR\data\updates"
  ${If} ${FileExists} "..\data\updates\*.*"
    SetOutPath "$INSTDIR\data\updates"
    File /r "..\data\updates\*.*"
  ${EndIf}
SectionEnd

Section "${MANAGER_NAME}" SecManager
  SectionIn 1 2
  SetOutPath "$INSTDIR\Manager"
  File /r "${MANAGER_DIR}\*.*"
SectionEnd

Section "${STUDENT_NAME}" SecStudent
  SectionIn 1 3
  SetOutPath "$INSTDIR\Student"
  File /r "${STUDENT_DIR}\*.*"
SectionEnd

Section -Post
  WriteUninstaller "$INSTDIR\uninstall.exe"

  ${If} $InstallScope == "all"
    SetShellVarContext all
  ${Else}
    SetShellVarContext current
  ${EndIf}

  !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
    CreateDirectory "$SMPROGRAMS\$STARTMENU_FOLDER"
    ${If} ${SectionIsSelected} ${SecServer}
      CreateShortcut "$SMPROGRAMS\$STARTMENU_FOLDER\${SERVER_NAME}.lnk" "$INSTDIR\Server\Queez CBT Server.exe" "" "$INSTDIR\Server\Queez CBT Server.exe" 0
      CreateShortcut "$DESKTOP\${SERVER_NAME}.lnk" "$INSTDIR\Server\Queez CBT Server.exe"
    ${EndIf}
    ${If} ${SectionIsSelected} ${SecManager}
      CreateShortcut "$SMPROGRAMS\$STARTMENU_FOLDER\${MANAGER_NAME}.lnk" "$INSTDIR\Manager\Queez CBT Manager.exe" "" "$INSTDIR\Manager\Queez CBT Manager.exe" 0
      CreateShortcut "$DESKTOP\${MANAGER_NAME}.lnk" "$INSTDIR\Manager\Queez CBT Manager.exe"
    ${EndIf}
    ${If} ${SectionIsSelected} ${SecStudent}
      CreateShortcut "$SMPROGRAMS\$STARTMENU_FOLDER\${STUDENT_NAME}.lnk" "$INSTDIR\Student\Queez CBT Student.exe" "" "$INSTDIR\Student\Queez CBT Student.exe" 0
      CreateShortcut "$DESKTOP\${STUDENT_NAME}.lnk" "$INSTDIR\Student\Queez CBT Student.exe"
    ${EndIf}
    CreateShortcut "$SMPROGRAMS\$STARTMENU_FOLDER\Uninstall ${SUITE_NAME}.lnk" "$INSTDIR\uninstall.exe"
  !insertmacro MUI_STARTMENU_WRITE_END

  ${If} $InstallScope == "all"
    CreateDirectory "$APPDATA\${SUITE_NAME}\data"
    ExecWait 'icacls "$APPDATA\${SUITE_NAME}" /grant *S-1-5-32-545:(OI)(CI)M /T /Q'
    CreateDirectory "$INSTDIR\data"
    ExecWait 'icacls "$INSTDIR\data" /grant *S-1-5-32-545:(OI)(CI)M /T /Q'
    CreateDirectory "$APPDATA\${SUITE_NAME}\data\updates"
    ExecWait 'icacls "$APPDATA\${SUITE_NAME}\data\updates" /grant *S-1-5-32-545:(OI)(CI)M /T /Q'
    ${If} ${FileExists} "..\data\updates\*.*"
      SetOutPath "$APPDATA\${SUITE_NAME}\data\updates"
      File /r "..\data\updates\*.*"
    ${EndIf}
    ${IfNot} ${FileExists} "$APPDATA\${SUITE_NAME}\data\license-public.pem"
      SetOutPath "$APPDATA\${SUITE_NAME}\data"
      File "..\config\license-public.pem"
    ${EndIf}
    ${IfNot} ${FileExists} "$INSTDIR\data\license-public.pem"
      SetOutPath "$INSTDIR\data"
      File "..\config\license-public.pem"
    ${EndIf}
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SUITE_NAME}" "DisplayName" "${SUITE_NAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SUITE_NAME}" "DisplayVersion" "${VERSION}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SUITE_NAME}" "Publisher" "${BRANDING_TEXT}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SUITE_NAME}" "UninstallString" '"$INSTDIR\uninstall.exe"'
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SUITE_NAME}" "DisplayIcon" "$INSTDIR\Manager\Queez CBT Manager.exe"
    WriteRegStr HKLM "Software\${BRANDING_TEXT}\${SUITE_NAME}" "Install_Dir" "$INSTDIR"
    WriteRegStr HKLM "Software\${BRANDING_TEXT}\${SUITE_NAME}" "InstallScope" "all"
  ${Else}
    CreateDirectory "$APPDATA\${SUITE_NAME}\data"
    CreateDirectory "$INSTDIR\data"
    ${IfNot} ${FileExists} "$APPDATA\${SUITE_NAME}\data\license-public.pem"
      SetOutPath "$APPDATA\${SUITE_NAME}\data"
      File "..\config\license-public.pem"
    ${EndIf}
    ${IfNot} ${FileExists} "$INSTDIR\data\license-public.pem"
      SetOutPath "$INSTDIR\data"
      File "..\config\license-public.pem"
    ${EndIf}
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SUITE_NAME}" "DisplayName" "${SUITE_NAME}"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SUITE_NAME}" "DisplayVersion" "${VERSION}"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SUITE_NAME}" "Publisher" "${BRANDING_TEXT}"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SUITE_NAME}" "UninstallString" '"$INSTDIR\uninstall.exe"'
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SUITE_NAME}" "DisplayIcon" "$INSTDIR\Manager\Queez CBT Manager.exe"
    WriteRegStr HKCU "Software\${BRANDING_TEXT}\${SUITE_NAME}" "Install_Dir" "$INSTDIR"
    WriteRegStr HKCU "Software\${BRANDING_TEXT}\${SUITE_NAME}" "InstallScope" "current"
  ${EndIf}

  System::Call 'shell32.dll::SHChangeNotify(i, i, p, p) v (0x08000000, 0, 0, 0)'

  ; Open Windows Firewall for LAN access - without this, student machines on the
  ; same router cannot reach the server even though it binds to 0.0.0.0
  ExecWait 'netsh advfirewall firewall delete rule name="Queez CBT Server"'
  ExecWait 'netsh advfirewall firewall add rule name="Queez CBT Server" dir=in action=allow protocol=TCP localport=4000 profile=any enable=yes'
  ExecWait 'netsh advfirewall firewall delete rule name="Queez CBT Discovery"'
  ExecWait 'netsh advfirewall firewall add rule name="Queez CBT Discovery" dir=in action=allow protocol=UDP localport=4001 profile=any enable=yes'
SectionEnd

; Component Descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SecServer} "Offline database and local assessment network engine. Required on the host computer running exams."
  !insertmacro MUI_DESCRIPTION_TEXT ${SecManager} "Exam creation, student registration, login slip printing, and marking portal for teachers."
  !insertmacro MUI_DESCRIPTION_TEXT ${SecStudent} "Secure examination taking portal used by candidates to enter login codes and take tests."
!insertmacro MUI_FUNCTION_DESCRIPTION_END

; Installation Scope Page callbacks
Function PageInstallScopeShow
  ${If} $Relaunched == 1
    Abort
  ${EndIf}

  !insertmacro MUI_HEADER_TEXT "Choose Installation Options" "Who should this application be installed for?"

  nsDialogs::Create 1018
  Pop $DialogInstallScope
  ${If} $DialogInstallScope == error
    Abort
  ${EndIf}

  ${NSD_CreateLabel} 0u 0u 300u 28u "Please select whether you wish to make ${SUITE_NAME} available to all users on this computer or only for yourself."
  Pop $0

  ${NSD_CreateRadioButton} 15u 35u 285u 14u "Anyone who uses this computer (all users)"
  Pop $RadioAllUsers

  ${NSD_CreateRadioButton} 15u 55u 285u 14u "Only for me (current user)"
  Pop $RadioCurrentUser

  ${If} $InstallScope == "current"
    ${NSD_Check} $RadioCurrentUser
  ${Else}
    ${NSD_Check} $RadioAllUsers
  ${EndIf}

  nsDialogs::Show
FunctionEnd

Function PageInstallScopeLeave
  ${NSD_GetState} $RadioAllUsers $0
  ${If} $0 == ${BST_CHECKED}
    ; User selected All Users
    UserInfo::GetAccountType
    Pop $1
    ${If} $1 != "Admin"
      ; Relaunch elevated with /allusers argument
      ClearErrors
      ExecShell "runas" "$EXEPATH" "/allusers"
      ${If} ${Errors}
        MessageBox MB_ICONEXCLAMATION|MB_OK "Administrator privileges are required to install for all users. Please select 'Only for me' or provide administrator credentials."
        Abort
      ${Else}
        Quit
      ${EndIf}
    ${EndIf}

    StrCpy $InstallScope "all"
    SetShellVarContext all
    StrCpy $INSTDIR "$PROGRAMFILES64\${SUITE_NAME}"
  ${Else}
    ; User selected Current User
    StrCpy $InstallScope "current"
    SetShellVarContext current
    StrCpy $INSTDIR "$LOCALAPPDATA\Programs\${SUITE_NAME}"
  ${EndIf}
FunctionEnd

Function .onInit
  ExecWait 'taskkill /F /IM "Queez CBT Server.exe" /T'
  ExecWait 'taskkill /F /IM "Queez CBT Manager.exe" /T'
  ExecWait 'taskkill /F /IM "Queez CBT Student.exe" /T'

  ; Check if /allusers argument was passed via command line or elevation
  ${GetParameters} $R0
  ClearErrors
  ${GetOptions} $R0 "/allusers" $R1
  ${IfNot} ${Errors}
    StrCpy $Relaunched 1
    StrCpy $InstallScope "all"
    SetShellVarContext all
    ReadRegStr $1 HKLM "Software\${BRANDING_TEXT}\${SUITE_NAME}" "Install_Dir"
    ${If} $1 != ""
      StrCpy $INSTDIR $1
    ${Else}
      StrCpy $INSTDIR "$PROGRAMFILES64\${SUITE_NAME}"
    ${EndIf}
    ; Bring the elevated installer window to the foreground immediately.
    ; Without this it appears behind the user's current app after UAC approval.
    BringToFront
    Return
  ${EndIf}

  StrCpy $Relaunched 0

  ; Check current account type
  UserInfo::GetAccountType
  Pop $0
  ${If} $0 == "Admin"
    StrCpy $InstallScope "all"
    SetShellVarContext all
    ReadRegStr $1 HKLM "Software\${BRANDING_TEXT}\${SUITE_NAME}" "Install_Dir"
    ${If} $1 != ""
      StrCpy $INSTDIR $1
    ${Else}
      StrCpy $INSTDIR "$PROGRAMFILES64\${SUITE_NAME}"
    ${EndIf}
  ${Else}
    StrCpy $InstallScope "current"
    SetShellVarContext current
    ReadRegStr $1 HKCU "Software\${BRANDING_TEXT}\${SUITE_NAME}" "Install_Dir"
    ${If} $1 != ""
      StrCpy $INSTDIR $1
    ${Else}
      StrCpy $INSTDIR "$LOCALAPPDATA\Programs\${SUITE_NAME}"
    ${EndIf}
  ${EndIf}
FunctionEnd

Function un.onInit
  ReadRegStr $0 HKLM "Software\${BRANDING_TEXT}\${SUITE_NAME}" "InstallScope"
  ${If} $0 == "all"
    SetShellVarContext all
  ${Else}
    ReadRegStr $0 HKCU "Software\${BRANDING_TEXT}\${SUITE_NAME}" "InstallScope"
    ${If} $0 == "current"
      SetShellVarContext current
    ${Else}
      SetShellVarContext all
    ${EndIf}
  ${EndIf}
FunctionEnd

; Launch helper
Function LaunchManager
  ${If} ${FileExists} "$INSTDIR\Manager\Queez CBT Manager.exe"
    Exec "$INSTDIR\Manager\Queez CBT Manager.exe"
  ${ElseIf} ${FileExists} "$INSTDIR\Server\Queez CBT Server.exe"
    Exec "$INSTDIR\Server\Queez CBT Server.exe"
  ${ElseIf} ${FileExists} "$INSTDIR\Student\Queez CBT Student.exe"
    Exec "$INSTDIR\Student\Queez CBT Student.exe"
  ${EndIf}
FunctionEnd

; ------------------------------------------------------------------------------
; Uninstaller Section
; ------------------------------------------------------------------------------

Section "Uninstall"
  !insertmacro MUI_STARTMENU_GETFOLDER Application $STARTMENU_FOLDER

  ; Delete shortcuts in active context
  Delete "$SMPROGRAMS\$STARTMENU_FOLDER\${SERVER_NAME}.lnk"
  Delete "$SMPROGRAMS\$STARTMENU_FOLDER\${MANAGER_NAME}.lnk"
  Delete "$SMPROGRAMS\$STARTMENU_FOLDER\${STUDENT_NAME}.lnk"
  Delete "$SMPROGRAMS\$STARTMENU_FOLDER\Uninstall ${SUITE_NAME}.lnk"
  Delete "$SMPROGRAMS\$STARTMENU_FOLDER\Queez Local Server.lnk"
  Delete "$SMPROGRAMS\$STARTMENU_FOLDER\Queez Assessment Manager.lnk"
  Delete "$SMPROGRAMS\$STARTMENU_FOLDER\Queez Student Portal.lnk"
  Delete "$SMPROGRAMS\$STARTMENU_FOLDER\Uninstall Queez CBT Suite.lnk"
  RMDir "$SMPROGRAMS\$STARTMENU_FOLDER"

  Delete "$DESKTOP\${SERVER_NAME}.lnk"
  Delete "$DESKTOP\${MANAGER_NAME}.lnk"
  Delete "$DESKTOP\${STUDENT_NAME}.lnk"
  Delete "$DESKTOP\Queez Local Server.lnk"
  Delete "$DESKTOP\Queez Assessment Manager.lnk"
  Delete "$DESKTOP\Queez Student Portal.lnk"

  ; Clean current context as well to prevent stray shortcuts
  SetShellVarContext current
  Delete "$SMPROGRAMS\$STARTMENU_FOLDER\${SERVER_NAME}.lnk"
  Delete "$SMPROGRAMS\$STARTMENU_FOLDER\${MANAGER_NAME}.lnk"
  Delete "$SMPROGRAMS\$STARTMENU_FOLDER\${STUDENT_NAME}.lnk"
  Delete "$SMPROGRAMS\$STARTMENU_FOLDER\Uninstall ${SUITE_NAME}.lnk"
  Delete "$SMPROGRAMS\$STARTMENU_FOLDER\Queez Local Server.lnk"
  Delete "$SMPROGRAMS\$STARTMENU_FOLDER\Queez Assessment Manager.lnk"
  Delete "$SMPROGRAMS\$STARTMENU_FOLDER\Queez Student Portal.lnk"
  Delete "$SMPROGRAMS\$STARTMENU_FOLDER\Uninstall Queez CBT Suite.lnk"
  RMDir "$SMPROGRAMS\$STARTMENU_FOLDER"

  Delete "$DESKTOP\${SERVER_NAME}.lnk"
  Delete "$DESKTOP\${MANAGER_NAME}.lnk"
  Delete "$DESKTOP\${STUDENT_NAME}.lnk"
  Delete "$DESKTOP\Queez Local Server.lnk"
  Delete "$DESKTOP\Queez Assessment Manager.lnk"
  Delete "$DESKTOP\Queez Student Portal.lnk"

  RMDir /r "$INSTDIR\Server"
  RMDir /r "$INSTDIR\Manager"
  RMDir /r "$INSTDIR\Student"
  Delete "$INSTDIR\uninstall.exe"
  RMDir "$INSTDIR"

  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SUITE_NAME}"
  DeleteRegKey HKLM "Software\${BRANDING_TEXT}\${SUITE_NAME}"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${SUITE_NAME}"
  DeleteRegKey HKCU "Software\${BRANDING_TEXT}\${SUITE_NAME}"
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\QueezCBTSuite"
  DeleteRegKey HKLM "Software\Quizeen\Queez CBT Suite"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\QueezCBTSuite"
  DeleteRegKey HKCU "Software\Quizeen\Queez CBT Suite"

  System::Call 'shell32.dll::SHChangeNotify(i, i, p, p) v (0x08000000, 0, 0, 0)'
SectionEnd
