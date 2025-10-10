# URLs-LE Troubleshooting Guide

## Overview

This guide provides solutions for common issues, error messages, and troubleshooting steps for URLs-LE. It covers installation, configuration, performance, and usage problems.

## Common Issues

### Installation Issues

#### Extension Not Installing

**Symptoms**: Extension fails to install or activate

**Causes**:

- VS Code version incompatibility
- Extension conflicts
- Corrupted installation
- Insufficient permissions

**Solutions**:

1. **Check VS Code Version**:

   ```bash
   # Check VS Code version
   code --version
   # Should be >= 1.105.0
   ```

2. **Clear Extension Cache**:

   ```bash
   # Clear VS Code extension cache
   rm -rf ~/.vscode/extensions/urls-le*
   ```

3. **Reinstall Extension**:

   - Uninstall the extension
   - Restart VS Code
   - Reinstall from marketplace

4. **Check Permissions**:
   ```bash
   # Check VS Code directory permissions
   ls -la ~/.vscode/
   ```

#### Extension Not Activating

**Symptoms**: Extension installs but doesn't activate

**Causes**:

- Missing dependencies
- Configuration errors
- Activation events not triggered

**Solutions**:

1. **Check Dependencies**:

   ```bash
   # Check Node.js version
   node --version
   # Should be >= 20.0.0
   ```

2. **Check Activation Events**:

   - Open a supported file type (`.md`, `.html`, `.css`, etc.)
   - Run a command from Command Palette
   - Check Output panel for errors

3. **Manual Activation**:
   ```bash
   # Run command to force activation
   code --command urls-le.extractUrls
   ```

### Configuration Issues

#### Settings Not Applying

**Symptoms**: Configuration changes don't take effect

**Causes**:

- VS Code settings cache
- Configuration conflicts
- Invalid settings values

**Solutions**:

1. **Reload VS Code**:

   ```bash
   # Reload VS Code window
   Ctrl+Shift+P -> "Developer: Reload Window"
   ```

2. **Check Settings Syntax**:

   ```json
   {
     "urls-le.copyToClipboardEnabled": true,
     "urls-le.dedupeEnabled": true,
     "urls-le.notificationsLevel": "important"
   }
   ```

3. **Reset Settings**:
   ```json
   {
     "urls-le.copyToClipboardEnabled": false,
     "urls-le.dedupeEnabled": false,
     "urls-le.notificationsLevel": "silent"
   }
   ```

#### Invalid Configuration Values

**Symptoms**: Error messages about invalid settings

**Causes**:

- Incorrect data types
- Out-of-range values
- Invalid enum values

**Solutions**:

1. **Check Data Types**:

   ```json
   {
     "urls-le.safety.fileSizeWarnBytes": 1000000, // number
     "urls-le.notificationsLevel": "important", // string
     "urls-le.copyToClipboardEnabled": true // boolean
   }
   ```

2. **Check Value Ranges**:

   ```json
   {
     "urls-le.safety.fileSizeWarnBytes": 1000, // minimum: 1000
     "urls-le.validation.timeout": 1000, // minimum: 1000
     "urls-le.safety.manyDocumentsThreshold": 1 // minimum: 1
   }
   ```

3. **Check Enum Values**:
   ```json
   {
     "urls-le.notificationsLevel": "all", // "all" | "important" | "silent"
     "urls-le.validation.followRedirects": true // boolean
   }
   ```

### Performance Issues

#### Slow URL Extraction

**Symptoms**: Extraction takes too long or freezes

**Causes**:

- Large file sizes
- Complex patterns
- Insufficient memory
- Network timeouts

**Solutions**:

1. **Check File Size**:

   ```bash
   # Check file size
   ls -lh filename.md
   # Consider splitting large files
   ```

2. **Adjust Safety Settings**:

   ```json
   {
     "urls-le.safety.enabled": true,
     "urls-le.safety.fileSizeWarnBytes": 500000,
     "urls-le.safety.largeOutputLinesThreshold": 25000
   }
   ```

3. **Enable Progress Indicators**:

   ```json
   {
     "urls-le.notificationsLevel": "important"
   }
   ```

4. **Use Cancellation**:
   - Press `Esc` to cancel long-running operations
   - Use Command Palette to stop commands

#### High Memory Usage

**Symptoms**: VS Code becomes slow or crashes

**Causes**:

- Large datasets
- Memory leaks
- Insufficient system memory

**Solutions**:

1. **Monitor Memory Usage**:

   ```bash
   # Check VS Code memory usage
   ps aux | grep "Visual Studio Code"
   ```

2. **Reduce Processing Limits**:

   ```json
   {
     "urls-le.safety.fileSizeWarnBytes": 100000,
     "urls-le.safety.largeOutputLinesThreshold": 10000,
     "urls-le.safety.manyDocumentsThreshold": 5
   }
   ```

3. **Clear Caches**:

   ```bash
   # Clear VS Code caches
   rm -rf ~/.vscode/CachedExtensions
   rm -rf ~/.vscode/logs
   ```

4. **Restart VS Code**:
   - Close VS Code completely
   - Restart to free memory

#### Network Timeouts

**Symptoms**: URL validation fails or times out

**Causes**:

- Slow network connections
- Server issues
- Incorrect timeout settings

**Solutions**:

1. **Increase Timeout**:

   ```json
   {
     "urls-le.validation.timeout": 10000
   }
   ```

2. **Disable Network Validation**:

   ```json
   {
     "urls-le.validation.enabled": false
   }
   ```

3. **Check Network Connectivity**:
   ```bash
   # Test network connectivity
   ping example.com
   curl -I https://example.com
   ```

### Usage Issues

#### No URLs Found

**Symptoms**: Extraction returns no results

**Causes**:

- Unsupported file format
- Incorrect patterns
- Empty content
- Filtering too strict

**Solutions**:

1. **Check File Format**:

   - Ensure file has supported extension
   - Check file content is not empty
   - Verify file is properly saved

2. **Check URL Patterns**:

   ```markdown
   # Valid patterns

   [Link](https://example.com)
   ![Image](https://example.com/image.png)
   <https://example.com>
   ```

3. **Check Content**:

   ```bash
   # Check file content
   cat filename.md
   # Ensure URLs are present
   ```

4. **Adjust Settings**:
   ```json
   {
     "urls-le.dedupeEnabled": false,
     "urls-le.showParseErrors": true
   }
   ```

#### Incorrect URL Extraction

**Symptoms**: Wrong URLs extracted or missing URLs

**Causes**:

- Pattern matching issues
- Format detection errors
- Content parsing problems

**Solutions**:

1. **Check Pattern Matching**:

   - Verify URL format in content
   - Check for special characters
   - Ensure proper encoding

2. **Enable Debug Mode**:

   ```json
   {
     "urls-le.showParseErrors": true,
     "urls-le.notificationsLevel": "all"
   }
   ```

3. **Check Output Panel**:

   - Open Output panel
   - Select "URLs-LE" from dropdown
   - Review error messages

4. **Test with Simple Content**:

   ```markdown
   # Test content

   [Test](https://example.com)
   ```

#### Command Not Working

**Symptoms**: Commands don't execute or fail

**Causes**:

- Extension not activated
- Command conflicts
- Permission issues
- Configuration errors

**Solutions**:

1. **Check Extension Status**:

   - Open Extensions panel
   - Verify URLs-LE is enabled
   - Check for error messages

2. **Check Command Palette**:

   ```bash
   # Open Command Palette
   Ctrl+Shift+P
   # Search for "URLs-LE"
   ```

3. **Check Keyboard Shortcuts**:

   ```json
   {
     "key": "ctrl+alt+u",
     "command": "urls-le.extractUrls",
     "when": "editorTextFocus"
   }
   ```

4. **Check Context Menu**:
   - Right-click in editor
   - Look for URLs-LE options
   - Verify file type is supported

## Error Messages

### Common Error Messages

#### "No active editor found"

**Cause**: No file is open in the editor

**Solution**:

1. Open a supported file type
2. Ensure file is saved
3. Try running command again

#### "File size exceeds safety limit"

**Cause**: File is too large for processing

**Solution**:

1. Split the file into smaller parts
2. Increase safety limits in settings
3. Use streaming mode if available

#### "Invalid URL format"

**Cause**: URL doesn't match expected format

**Solution**:

1. Check URL syntax
2. Ensure proper encoding
3. Verify URL is complete

#### "Network timeout"

**Cause**: Network request took too long

**Solution**:

1. Increase timeout setting
2. Check network connectivity
3. Disable network validation

#### "Permission denied"

**Cause**: Insufficient file permissions

**Solution**:

1. Check file permissions
2. Run VS Code as administrator
3. Change file ownership

### Debugging Steps

#### Enable Debug Logging

```json
{
  "urls-le.showParseErrors": true,
  "urls-le.notificationsLevel": "all"
}
```

#### Check Output Panel

1. Open Output panel (`Ctrl+Shift+U`)
2. Select "URLs-LE" from dropdown
3. Review error messages and logs

#### Check Developer Console

1. Open Developer Tools (`Ctrl+Shift+I`)
2. Check Console tab for errors
3. Look for URLs-LE related messages

#### Check Extension Host

1. Open Command Palette (`Ctrl+Shift+P`)
2. Run "Developer: Show Running Extensions"
3. Check URLs-LE status

## Performance Optimization

### System Requirements

- **VS Code**: >= 1.105.0
- **Node.js**: >= 20.0.0
- **Memory**: >= 4GB RAM
- **Storage**: >= 100MB free space

### Optimization Tips

1. **Close Unused Extensions**: Disable other extensions
2. **Increase Memory Limits**: Adjust VS Code settings
3. **Use SSD Storage**: Faster file access
4. **Regular Updates**: Keep VS Code updated

### Memory Management

```json
{
  "urls-le.safety.enabled": true,
  "urls-le.safety.fileSizeWarnBytes": 500000,
  "urls-le.safety.largeOutputLinesThreshold": 25000
}
```

## Getting Help

### Documentation

- **README.md**: Basic usage and installation
- **ARCHITECTURE.md**: Technical architecture
- **SPECIFICATION.md**: Feature specifications
- **COMMANDS.md**: Command reference
- **CONFIGURATION.md**: Settings guide

### Support Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and community support
- **Documentation**: Comprehensive guides and references

### Reporting Issues

When reporting issues, include:

1. **VS Code Version**: `code --version`
2. **Extension Version**: Check Extensions panel
3. **Operating System**: OS version and architecture
4. **Error Messages**: Copy from Output panel
5. **Steps to Reproduce**: Detailed reproduction steps
6. **Expected Behavior**: What should happen
7. **Actual Behavior**: What actually happens

### Providing Feedback

- **Feature Requests**: Use GitHub Issues
- **Bug Reports**: Include detailed information
- **Documentation**: Suggest improvements
- **Performance**: Report performance issues

This troubleshooting guide provides comprehensive solutions for common URLs-LE issues, ensuring users can resolve problems quickly and effectively.
