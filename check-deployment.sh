#!/bin/bash

echo "🌐 Checking AgroConnect World Deployment..."
echo "============================================"

DOMAIN="agroconnectworld.com"
API="$DOMAIN/api"
HEALTH="$DOMAIN/health"

# 1. Check DNS resolution
echo "📡 Step 1: Checking DNS resolution..."
DNS_IP=$(dig +short $DOMAIN | tail -n1)
EXPECTED_IP="34.46.140.99"

if [[ "$DNS_IP" == "$EXPECTED_IP" ]]; then
  echo "✅ DNS is pointing correctly to $EXPECTED_IP"
else
  echo "❌ DNS mismatch: got $DNS_IP, expected $EXPECTED_IP"
fi

# 2. Check HTTPS
echo -e "\n🔐 Step 2: Checking HTTPS and SSL certificate..."
SSL_OUTPUT=$(echo | openssl s_client -connect $DOMAIN:443 -servername $DOMAIN 2>/dev/null | openssl x509 -noout -issuer -subject -dates)

if [[ "$SSL_OUTPUT" == *"BEGIN CERTIFICATE"* || "$SSL_OUTPUT" == "" ]]; then
  echo "❌ SSL not valid or missing"
else
  echo "✅ SSL is active:"
  echo "$SSL_OUTPUT"
fi

# 3. Test frontend
echo -e "\n🧪 Step 3: Checking frontend homepage..."
FRONT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN)

if [[ "$FRONT_STATUS" == "200" ]]; then
  echo "✅ Frontend is responding with HTTP 200"
else
  echo "❌ Frontend returned HTTP $FRONT_STATUS"
fi

# 4. Test individual microservices
echo -e "\n🔁 Step 4: Checking individual microservices..."
echo "Testing Product Service..."
PRODUCT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN:8081)
if [[ "$PRODUCT_STATUS" == "200" || "$PRODUCT_STATUS" == "401" ]]; then
  echo "✅ Product Service is reachable (HTTP $PRODUCT_STATUS)"
else
  echo "❌ Product Service unreachable (HTTP $PRODUCT_STATUS)"
fi

echo "Testing Order Service..."
ORDER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN:8082)
if [[ "$ORDER_STATUS" == "200" || "$ORDER_STATUS" == "401" ]]; then
  echo "✅ Order Service is reachable (HTTP $ORDER_STATUS)"
else
  echo "❌ Order Service unreachable (HTTP $ORDER_STATUS)"
fi

echo "Testing User Service..."
USER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN:8083)
if [[ "$USER_STATUS" == "200" || "$USER_STATUS" == "401" ]]; then
  echo "✅ User Service is reachable (HTTP $USER_STATUS)"
else
  echo "❌ User Service unreachable (HTTP $USER_STATUS)"
fi

# 5. Check system status
echo -e "\n🩺 Step 5: Checking system status..."
echo "Testing direct IP access..."
DIRECT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://34.46.140.99)
if [[ "$DIRECT_STATUS" == "200" ]]; then
  echo "✅ Direct IP access working (HTTP $DIRECT_STATUS)"
else
  echo "❌ Direct IP access failed (HTTP $DIRECT_STATUS)"
fi

echo -e "\n✅ Check complete."
echo -e "\n📊 Summary:"
echo "Frontend: https://$DOMAIN"
echo "Product Service: https://$DOMAIN:8081"
echo "Order Service: https://$DOMAIN:8082"
echo "User Service: https://$DOMAIN:8083"
echo "Direct Access: http://34.46.140.99" 