# Managing Network Ports and Processes

<details><summary>Managing Network Ports and Processes</summary>
| Task                     | Windows                             | Linux/Mac                           |
| ------------------------ | ----------------------------------- | ----------------------------------- |
| List all listening ports | `netstat -aon \| findstr LISTENING` | `sudo lsof -i -P -n \| grep LISTEN` |
| Find specific port       | `netstat -aon \| findstr :PORT`     | `lsof -i :PORT`                     |
| Kill process             | `taskkill /PID PID /F`              | `kill -9 PID`                       |

<details><summary>Command-line options or flags</summary>

- `-a` → all connections and listening ports
- `-o` → shows PID
- `-n` → numeric
- `/F` → forcefully terminates the process

- `-i` → network files
- `-P` → show port numbers (don't resolve service names)
- `-n` → don't resolve hostnames

- `-9` → forcefully kills the process

</details>
</details>
