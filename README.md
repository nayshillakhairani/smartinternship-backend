## Local Running

Create .env
```
cp .env.example .env

```

+ Anda dapat menghasilkan kata sandi aplikasi untuk akun Google terlebih dahulu. Silakan lihat referensi berikut:[Cara Membuat Kata Sandi Aplikasi](https://knowledge.workspace.google.com/kb/how-to-create-app-passwords-000009237)

Install Depedencies
```
npm install
```
or
```
pnpm install
```

Running Migration
```
npx prisma migrate dev
```
Running Seeding
```
npx prisma db seed
```
Running App
```
npm run dev
```

## Local Running dengan docker

Create .env

```
cp .env.example .env
```
+ Anda dapat menghasilkan kata sandi aplikasi untuk akun Google terlebih dahulu. Silakan lihat referensi berikut:[Cara Membuat Kata Sandi Aplikasi](https://knowledge.workspace.google.com/kb/how-to-create-app-passwords-000009237)

Build Image

```
docker build . --tag nama_image:latest
```

Running Image

```
docker run -d --name nama_container -p "port yang di sesuaikan dengan nginx.conf" nama_image:latest
```

Running Seeding
```
docker exec -it nama_container npx prisma db seed
```

## Docker-Compose Running

docker compose example
```
version: '3'
services:
  mysql-server:
    image: mysql
    restart: always
    # jangan lupa buat directory ~/data-mysql & ~/config-mysql di host
    volumes:
      - ~/data-mysql:/var/lib/mysql
      - ~/config-mysql:/etc/mysql/conf.d
    # buat password untuk mysql & database yang akan digunakan
    environment:
      MYSQL_ROOT_PASSWORD: PASSWORD_DATABASE
      MYSQL_DATABASE: NAMA_DATABASE

  # sesuaikan dengan backend-image yang telah di setup
  backend:
    # sesuaikan dengan image yang telah di build
    image: zikrisuanda11/smart-internship-backend:latest
    ports:
      # export port sesuai kebutuhan
      - "5531:5531"
    depends_on:
      - mysql-server
    # jangan lupa buat folder dan lakukan mount ke /usr/app/storage
    volumes:
      # contoh:
      - /home/smartinternship/storage:/usr/app/storage


  frontend:
    # sesuaikan dengan image yang telah di build
    image: zikrisuanda11/smart-internship-frontend:latest
    ports:
      - "3674:3674"
    depends_on:
      - backend

  webserver:
    image: nginx:latest
    ports:
      - 80:80
      - 443:443
    restart: always
    # bind volumes
    volumes:
      - ./nginx/conf/:/etc/nginx/conf.d/:ro
      - ./certbot/conf/:/etc/letsencrypt:ro
      - ./certbot/www/:/var/www/certbot/:ro

  # gunakan image certbot jika ingin menggunakan certificate SSL
  certbot:
    image: certbot/certbot:latest
    volumes:
      - ./certbot/www/:/var/www/certbot/:rw
      - ./certbot/conf/:/etc/letsencrypt/:rw
```
