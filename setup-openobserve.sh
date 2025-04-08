
# 2. START OPENOBSERVE CONTAINER
echo "🚀 Starting OpenObserve..."
docker run -d --rm \
  --name openobserve \
  -e "ZO_ROOT_USER_EMAIL=admin@example.com" \
  -e "ZO_ROOT_USER_PASSWORD=ComplexPass#123" \
  -p 5080:5080 \
  -v openobserve_data:/data \
  public.ecr.aws/zinclabs/openobserve:latest

# 3. WAIT FOR OPENOBSERVE TO BE READY
echo "⏳ Waiting for OpenObserve to be ready..."
sleep 10  # You can implement health checks here if needed

# 4. DOWNLOAD SAMPLE DATA
echo "⬇️ Downloading sample log data..."
curl -L https://zinc-public-data.s3.us-west-2.amazonaws.com/zinc-enl/sample-k8s-logs/k8slog_json.json.zip -o k8slog_json.json.zip
unzip -o k8slog_json.json.zip

# 5. LOAD SAMPLE DATA INTO OPENOBSERVE
echo "📦 Ingesting sample data..."
curl -i -u "admin@example.com:ComplexPass#123" -d "@k8slog_json.json" http://localhost:5080/api/default/default/_json
