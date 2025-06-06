# Harness Pipeline Configuration for SmartInternship

This directory contains the Harness CI/CD pipeline configuration for the SmartInternship project.

## Overview

The pipeline is designed to:
1. Build a Docker image for the SmartInternship application
2. Push the image to Docker Hub with version tag 1.0.0
3. Pull the latest image and run tests

## Configuration Files

- `pipeline.yaml`: The main pipeline configuration

## Pipeline Features

- Builds Docker image with necessary Babel plugins
- Uses Docker Hub credentials for authentication
- Tags and pushes images with proper versioning
- Runs automated tests in the container

## Setup Requirements

To use this pipeline in Harness:

1. Create a Harness project called 'SmartInternship'
2. Configure the following connectors in Harness:
   - GitHub connector (for code repository)
   - Kubernetes cluster connector (for execution infrastructure)
   - Docker registry connector (for image storage)

## Setting Up Secrets

The pipeline requires the following secrets to be set up in Harness:

1. Log in to your Harness account
2. Navigate to Security > Secrets Management
3. Create the following Text Secrets:
   - **dockerhub_username**: Your Docker Hub username (e.g., nayshillakhairani)
   - **dockerhub_password**: Your Docker Hub password or personal access token

IMPORTANT: Never store actual secrets in your repository files as this will trigger GitHub's secret scanning protection and block pushes.

## Security Notes

- Docker Hub credentials must be stored as Harness secrets, not in code
- The pipeline references these secrets using `<+secrets.getValue("secret_name")>` syntax
- Avoid adding actual secret values to the pipeline.yaml file

## Execution

When triggered, the pipeline will:
1. Clone the repository
2. Build the Docker image
3. Authenticate with Docker Hub using the configured secrets
4. Push the image with tag 1.0.0
5. Run tests on the latest image

For more information about Harness pipelines and secure secret management, please refer to the [official Harness documentation](https://developer.harness.io/docs/platform/secrets/secrets-management/add-use-text-secrets).