# docker image

To run the bot via a docker image you'll need to build the image locally:

```shell
$> docker build . -t gitcoin:latest # run from repository root
```

After this you'll need to adjust the environment variables contained in `docker-compose.yml`. After doing this start the docker container with `docker-compose up -d`