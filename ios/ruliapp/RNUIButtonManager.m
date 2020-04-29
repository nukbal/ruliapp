
#import "RNUIButtonManager.h"

#import <React/RCTUIManager.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <React/UIView+React.h>

@implementation RNUIButtonManager

RCT_EXPORT_MODULE(RNUIButton)

- (UIButton *)view
{
  return [UIButton new];
}

RCT_CUSTOM_VIEW_PROPERTY(pointerEnabled, BOOL, UIButton) {
  if (@available(iOS 13.4, *)) {
    view.pointerInteractionEnabled = json ? [RCTConvert BOOL:json] : defaultView.pointerInteractionEnabled;
  }
}

RCT_CUSTOM_VIEW_PROPERTY(disabled, BOOL, UIButton)
{
  if (json) {
    view.enabled = !([RCTConvert BOOL:json]);
  } else {
    view.enabled = defaultView.enabled;
  }
}

@end
