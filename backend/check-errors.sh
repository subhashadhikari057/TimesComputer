#!/bin/bash

echo "🔍 Backend Error Check Script"
echo "============================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
ERRORS_FOUND=0

echo ""
echo "1️⃣ Checking TypeScript Compilation..."
if npx tsc --noEmit --pretty; then
    echo -e "${GREEN}✅ TypeScript compilation: PASSED${NC}"
else
    echo -e "${RED}❌ TypeScript compilation: FAILED${NC}"
    ERRORS_FOUND=1
fi

echo ""
echo "2️⃣ Checking Build Process..."
if npm run build > build.log 2>&1; then
    echo -e "${GREEN}✅ Build process: PASSED${NC}"
else
    echo -e "${RED}❌ Build process: FAILED${NC}"
    echo "Build errors:"
    cat build.log
    ERRORS_FOUND=1
fi

echo ""
echo "3️⃣ Checking JavaScript Syntax..."
if node -c dist/server.js 2>/dev/null; then
    echo -e "${GREEN}✅ JavaScript syntax: PASSED${NC}"
else
    echo -e "${RED}❌ JavaScript syntax: FAILED${NC}"
    ERRORS_FOUND=1
fi

echo ""
echo "4️⃣ Checking Dependencies..."
if npm ls > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Dependencies: PASSED${NC}"
else
    echo -e "${YELLOW}⚠️ Dependencies: Some issues found${NC}"
    npm ls 2>&1 | grep -E "(WARN|ERROR)" || true
fi

echo ""
echo "5️⃣ Checking Security Vulnerabilities..."
AUDIT_OUTPUT=$(npm audit --audit-level high 2>&1)
if echo "$AUDIT_OUTPUT" | grep -q "found 0 vulnerabilities"; then
    echo -e "${GREEN}✅ Security: No high-risk vulnerabilities${NC}"
else
    echo -e "${YELLOW}⚠️ Security: Vulnerabilities found${NC}"
    npm audit --audit-level high
fi

echo ""
echo "6️⃣ Checking Environment Setup..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ Environment file: EXISTS${NC}"
else
    echo -e "${YELLOW}⚠️ Environment file: NOT FOUND${NC}"
fi

echo ""
echo "7️⃣ Testing Server Startup..."
# Create a test script that starts server and kills it
cat > test-server.js << 'EOF'
const { spawn } = require('child_process');
const server = spawn('node', ['dist/server.js'], { stdio: 'pipe' });
let output = '';
let hasError = false;

server.stdout.on('data', (data) => { output += data.toString(); });
server.stderr.on('data', (data) => { 
    output += data.toString(); 
    if (data.toString().includes('Error')) hasError = true;
});

setTimeout(() => {
    server.kill();
    if (hasError || output.includes('Error')) {
        console.log('❌ Server startup: FAILED');
        console.log(output);
        process.exit(1);
    } else {
        console.log('✅ Server startup: PASSED');
        process.exit(0);
    }
}, 3000);
EOF

if node test-server.js; then
    echo -e "${GREEN}✅ Server startup: PASSED${NC}"
else
    echo -e "${RED}❌ Server startup: FAILED${NC}"
    ERRORS_FOUND=1
fi

# Cleanup
rm -f test-server.js build.log

echo ""
echo "============================="
if [ $ERRORS_FOUND -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL CHECKS PASSED! Your backend is ready.${NC}"
    exit 0
else
    echo -e "${RED}💥 ERRORS FOUND! Please fix the issues above.${NC}"
    exit 1
fi 