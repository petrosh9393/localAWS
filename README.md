# Installation

## Bootstrap

Install dependencies:
```shell
npm install
```

Add SQS service in `docker-compose.yml`
```yaml
  localstack:
    container_name: localstack
    image: localstack/localstack
    depends_on: [lb]
    ports:
      - "4566:4566"
    environment:
      - SERVICES=${LOCALSTACK_SERVICES:-s3,sns,sqs} # <- Here
      - HOSTNAME=${LOCALSTACK_HOSTNAME:-localstack}
      - HOSTNAME_EXTERNAL=${LOCALSTACK_HOSTNAME_EXTERNAL:-localstack}
      - DEBUG=${LOCALSTACK_DEBUG:-false}
      - DATA_DIR=${LOCALSTACK_DATA_DIR:-/tmp/localstack/data}
      - HOST_TMP_FOLDER=${LOCALSTACK_TMPDIR:-/tmp}
    volumes:
      - "./services/localstack/aws:/docker-entrypoint-initaws.d"
      - "${TMPDIR:-/tmp/localstack}:/tmp/localstack"
      - aws-credentials:/root/.aws
```

Add new SNS topic in localstack here: `services/localstack/aws/sns.sh`
```shell
awslocal sns create-topic --name contracts-topic
```

Start publisher:
```shell
npm run publisher
```
