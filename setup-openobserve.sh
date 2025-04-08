#!/bin/bash

# 1. CLEAN UP PREVIOUS RUN
echo " Cleaning up any previous containers..."
docker stop openobserve 2>/dev/null || true

# 2. START OPENOBSERVE CONTAINER
echo " Starting OpenObserve..."
docker run -d --rm \
  --name openobserve \
  -e "ZO_ROOT_USER_EMAIL=admin@example.com" \
  -e "ZO_ROOT_USER_PASSWORD=ComplexPass#123" \
  -p 5080:5080 \
  -v openobserve_data:/data \
  public.ecr.aws/zinclabs/openobserve:latest

# 3. WAIT FOR OPENOBSERVE TO BE READY
echo " Waiting for OpenObserve to be ready..."
sleep 10  # Consider replacing with a health check loop

# 4. DOWNLOAD SAMPLE DATA
echo " Downloading sample log data..."
curl -L https://zinc-public-data.s3.us-west-2.amazonaws.com/zinc-enl/sample-k8s-logs/k8slog_json.json.zip -o k8slog_json.json.zip
unzip -o k8slog_json.json.zip

# 5. LOAD SAMPLE DATA INTO OPENOBSERVE
echo " Ingesting sample data..."
curl -i -u "admin@example.com:ComplexPass#123" -d "@k8slog_json.json" http://localhost:5080/api/default/default/_json

# 6. CLONE GIT REPOSITORY (MAIN BRANCH)
REPO_URL="https://github.com/gulshangopalani/openobserve.git"  # 
PROJECT_DIR="openobserve"                               

echo " Cloning Git repo..."
git clone --depth 1 --branch main "$REPO_URL"

# 7. INSTALL DEPENDENCIES
echo " Installing dependencies..."
cd "$PROJECT_DIR/Automation"
npm ci || npm install

# 8. RUN PLAYWRIGHT TEST CASES
echo " Running Playwright tests..."
npx playwright install  # Optional: ensure browsers are installed
npx playwright test

# 9. DONE
echo " All steps completed!"
