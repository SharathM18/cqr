# Python Snippets

<details><summary>File Handling - JSON</summary>

```python
import os
import json

# Retrieve the data from file
def load_file(self, file_name):
    if os.path.exists(f'{file_name}.json'):
        with open(f'{file_name}.json','r') as file:
            return json.load(file)
    else:
        return {}

# Save the data's to the file
def save_data(self, file_name, data):
    with open(f'{file_name}.json','w') as file:
        json.dump(data, file, indent=4)
```

</details>
