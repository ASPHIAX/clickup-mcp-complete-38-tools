FROM node:20-alpine

# Create consistent user
RUN addgroup -g 1001 mcpuser && \
    adduser -u 1001 -G mcpuser -h /home/mcpuser -s /bin/sh -D mcpuser

# Set working directory and create it with proper ownership
WORKDIR /home/mcpuser/app
RUN chown -R mcpuser:mcpuser /home/mcpuser

# Copy package files with correct ownership
COPY --chown=mcpuser:mcpuser package*.json ./

# Switch to mcpuser and install dependencies
USER mcpuser
RUN npm install

# Copy application code
COPY --chown=mcpuser:mcpuser . .

# Expose port
EXPOSE 3000
# Start application
CMD ["node", "clickup-complete-modular.cjs"]
