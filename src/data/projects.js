/**
 * Project catalogue used by the Phase 7 immersive showcases.
 * Each entry is intentionally rich so the 3D layer can theme itself per project.
 */
export const PROJECTS = [
  {
    id: 'ilter-akke',
    title: 'ILTER-AKKE Smart Glove',
    subtitle: 'Smart Command & Control Glove',
    summary:
      'A gesture-driven wearable that maps hand motion to real-time commands — bridging embedded sensing and human-computer interaction.',
    tags: ['Embedded', 'Sensors', 'HCI', 'Firmware'],
    repo: 'https://github.com/ILTER-AKKE/AKKE-Smart-Command-Control-Glove',
    accent: '#5eead4',
  },
  {
    id: 'fakeiot-honeypot',
    title: 'FakeIoT Honeypot',
    subtitle: 'IoT Deception & Threat Intelligence',
    summary:
      'A honeypot that impersonates vulnerable IoT devices to lure, observe and log attacker behaviour for security research.',
    tags: ['Security', 'IoT', 'Networking', 'Python'],
    repo: 'https://github.com/FakeIoTHoneypot/FakeIoTHoneypot',
    accent: '#f472b6',
  },
  {
    id: 'campusquest',
    title: 'CampusQuest',
    subtitle: 'iOS Exploration Game',
    summary:
      'An iOS game that turns the campus into a quest-driven playground — location, progression and playful UI in a native Swift build.',
    tags: ['iOS', 'Swift', 'Game', 'Mobile'],
    repo: 'https://github.com/Aosll/CampusQuest',
    accent: '#818cf8',
  },
];

export default PROJECTS;
