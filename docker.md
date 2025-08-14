# Docker

<details>
<summary>Save and Load Docker image and compress it using gzip</summary>
  
<br>
  
```bash
docker save my-image:tag | gzip > my-image.tar.gz
```

```bash
gunzip -c my-image.tar.gz | docker load
```
</details>
