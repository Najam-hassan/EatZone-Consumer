## Please read these instructions carefully

This repo is built on RN 0.59.8. So in order to run it on xCode 11, following changes are mandatory.

- Install node modules by running npm install.
- Go to ios folder and run pod install
```sh
cd ios && pod install
```
- Open the file in node_modules/react-native/React/Base/RCTModuleMethod.mm
- At about line 91, you will see a function like this.
```sh
static BOOL RCTParseUnused(const char **input)
```

- Remove everything inside the fucntion and replace it with

```sh
{
  return RCTReadString(input, "__attribute__((unused))") ||
         RCTReadString(input, "__attribute__((__unused__))") ||
         RCTReadString(input, "__unused");
}
```

- Go to node_modules/react-native-fbsdk/ios/RCTFBSDK/login/RCTFBSDKLoginButtonManager.m and remove everything in the file and paste the following.

```sh

#import "RCTFBSDKLoginButtonManager.h"

#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTUtils.h>
#import <React/UIView+React.h>

#import "RCTConvert+FBSDKLogin.h"

@implementation RCTFBSDKLoginButtonManager

RCT_EXPORT_MODULE(RCTFBLoginButton)

#pragma mark - Object Lifecycle

- (UIView *)view
{
    FBSDKLoginButton *loginButton = [[FBSDKLoginButton alloc] init];
    loginButton.delegate = self;
    return loginButton;
}

#pragma mark - Properties

RCT_EXPORT_VIEW_PROPERTY(readPermissions, NSStringArray)

RCT_EXPORT_VIEW_PROPERTY(publishPermissions, NSStringArray)

RCT_CUSTOM_VIEW_PROPERTY(loginBehaviorIOS, FBSDKLoginBehavior, FBSDKLoginButton)
{
    [view setLoginBehavior:json ? [RCTConvert FBSDKLoginBehavior:json] : FBSDKLoginBehaviorBrowser];
}

RCT_EXPORT_VIEW_PROPERTY(defaultAudience, FBSDKDefaultAudience)

RCT_CUSTOM_VIEW_PROPERTY(tooltipBehaviorIOS, FBSDKLoginButtonTooltipBehavior, FBSDKLoginButton)
{
    [view setTooltipBehavior:json ? [RCTConvert FBSDKLoginButtonTooltipBehavior:json] : FBSDKLoginButtonTooltipBehaviorAutomatic];
}

#pragma mark - FBSDKLoginButtonDelegate

- (void)loginButton:(FBSDKLoginButton *)loginButton didCompleteWithResult:(FBSDKLoginManagerLoginResult *)result error:(NSError *)error
{
    NSDictionary *event = @{
                           @"type": @"loginFinished",
                           @"target": loginButton.reactTag,
                           @"error": error ? RCTJSErrorFromNSError(error) : [NSNull null],
                           @"result": error ? [NSNull null] : @{
                                   @"isCancelled": @(result.isCancelled),
                                   @"grantedPermissions": result.isCancelled ? [NSNull null] : result.grantedPermissions.allObjects,
                                   @"declinedPermissions": result.isCancelled ? [NSNull null] : result.declinedPermissions.allObjects,
                                   },
                           };
    
     [self.bridge.eventDispatcher sendInputEventWithName:@"topChange" body:event];
    [self.bridge.eventDispatcher sendEvent:event];
}

- (void)loginButtonDidLogOut:(FBSDKLoginButton *)loginButton
{
    NSDictionary *event = @{
                            @"target": loginButton.reactTag,
                           };
    
    [self.bridge.eventDispatcher sendInputEventWithName:@"topChange" body:event];
    [self.bridge.eventDispatcher sendEvent:event];
}

@end

```

This is it. Your code should now work.

#### I am writing these instructions on 11 July 2020. The latest xcode is 11.5 on this date. If you are using a later version of xcode and something else goes wrong, kidnly search for the issue and place the instructions in this file.
