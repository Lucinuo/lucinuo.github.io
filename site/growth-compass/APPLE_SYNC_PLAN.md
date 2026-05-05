# Apple Native Sync Plan

## Current State

This project is currently a static Web/PWA app:

- UI: HTML, CSS, vanilla JavaScript
- Local storage: browser `localStorage`
- Existing cloud sync: Supabase Auth + `growth_entries`
- Apple native targets: none
- SwiftUI/UIKit: not present
- SwiftData/CoreData: not present
- Xcode project/workspace: not present

Because the app is not an Apple native app, it cannot directly use SwiftData,
CoreData, iCloud entitlements, or CloudKit automatic sync.

## Minimal Apple-Native Direction

The smallest Apple-native sync path is to create a new SwiftUI multiplatform
target while preserving the current app structure:

- Today: daily 5-minute entry
- Flow: daily routing
- Weekly Review: weekly pillar reflection

Recommended stack:

- SwiftUI
- SwiftData
- CloudKit-backed `ModelContainer`
- iCloud capability with a private CloudKit database

Fallback stack if SwiftData becomes limiting:

- CoreData
- `NSPersistentCloudKitContainer`

Do not use Firebase, Supabase, or a custom backend for the Apple-native version
unless CloudKit becomes impossible for the chosen target setup.

## CloudKit-Compatible Models

SwiftData models should include stable identifiers and timestamps:

```swift
@Model
final class DailyEntry {
    @Attribute(.unique) var id: UUID
    var date: Date
    var state: String
    var mood: String
    var keyEvent: String
    var reusableTrace: String
    var nextSmallStep: String
    var createdAt: Date
    var updatedAt: Date
}

@Model
final class FlowItem {
    @Attribute(.unique) var id: UUID
    var createdAt: Date
    var updatedAt: Date
    var content: String
    var category: String
    var status: String
    var linkedDate: Date?
}

@Model
final class WeeklyReview {
    @Attribute(.unique) var id: UUID
    var weekStartDate: Date
    var pillar: String
    var content: String
    var createdAt: Date
    var updatedAt: Date
}
```

CloudKit sync works best when:

- every record has a stable unique id
- every record has `createdAt` and `updatedAt`
- relationships are optional or simple
- enum values are stored as strings if CloudKit compatibility is a concern

## Migration Strategy

1. Keep the current Web/PWA app working.
2. Export current data as JSON from the app.
3. Create the SwiftUI + SwiftData app.
4. Add JSON import for the current schema:
   - `dailyEntries`
   - `flowItems`
   - `weeklyReviews`
5. Import records locally.
6. Let SwiftData + CloudKit sync them through iCloud.
7. After verifying sync across Mac, iPad, and iPhone, retire Supabase from the
   Apple-native app.

## Required Manual Apple Setup

This part cannot be completed from the current static Web project alone:

- Create an Xcode project or Swift package app target.
- Add bundle identifier.
- Enable iCloud capability.
- Enable CloudKit.
- Select or create a CloudKit container.
- Sign with an Apple Developer account.
- Build on Mac, iPad, and iPhone simulators/devices.

## Why Not Direct iCloud Sync In This PWA

Safari/Web apps cannot use SwiftData, CoreData, or iCloud entitlements directly.
CloudKit JS is technically possible, but it is not the same as SwiftData +
CloudKit automatic sync and requires Apple Developer web auth setup. For this
project, CloudKit JS would be a web-auth integration, not the requested native
Apple storage layer.
