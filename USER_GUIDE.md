# Contact Check-in Application - User Guide

Welcome to the Contact Check-in Application! This guide will help you get started and make the most of the app's features.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Managing Contacts](#managing-contacts)
3. [Managing Categories](#managing-categories)
4. [Check-in System](#check-in-system)
5. [Dashboard Overview](#dashboard-overview)
6. [Notifications](#notifications)
7. [Data Management](#data-management)
8. [Tips & Best Practices](#tips--best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Launch

When you first open the app, you'll see a welcome screen introducing the key features:

- **Contact Management** - Store and organize your contacts
- **Smart Scheduling** - Automated check-in reminders
- **Check-in Tracking** - Mark check-ins complete with notes
- **Data Portability** - Export and import your data

Click **"Get Started"** to initialize the app with default categories.

### Default Categories

The app creates four default categories on first launch:

1. **Family** - Check in weekly
2. **Close Friends** - Check in monthly
3. **Friends** - Check in quarterly (every 3 months)
4. **Professional** - Check in quarterly

You can customize these or create new categories later.

### Navigation

The app has five main sections accessible from the navigation bar:

- **Dashboard** - Overview of upcoming and overdue check-ins
- **Contacts** - Manage your contact list
- **Categories** - Manage relationship categories
- **Check-ins** - Browse and manage all check-ins
- **Settings** - Configure notifications and manage data

---

## Managing Contacts

### Adding a Contact

1. Navigate to **Contacts**
2. Click the **"Create Contact"** button (+ icon)
3. Fill in the required fields:
   - **Name** (required)
   - **Email** (required, format: `name@domain.com`)
   - **Phone** (required, E.164 format: `+1234567890`)
   - **City** (required)
   - **Country** (required)
   - **Timezone** (required, select from dropdown)
4. **Select a Category** (required if categories exist)
   - Choose a category to assign check-in frequency
   - Displays as "Category Name - Frequency" (e.g., "Family - Every 1 week")
   - If no categories exist, you'll see a message to create one first
5. Optional fields:
   - **Relationship Context** - How you know this person
   - **Important Dates** - Birthdays, anniversaries, etc.
6. Click **"Save"**

The app will automatically schedule the first check-in based on the category's frequency.

**Note**: Category selection is required when creating a contact (if categories exist). You can create contacts without categories only if you haven't created any categories yet.

### Editing a Contact

1. Navigate to **Contacts**
2. Click the **"Edit"** button on any contact card
3. Update the fields you want to change
   - Category is optional in edit mode (can be left unchanged)
   - If you change the category, the contact will be reassigned
4. Click **"Save"**

**Note**: If you change a contact's category, they will be reassigned to the new category. Existing check-ins remain unchanged, but future check-in scheduling will use the new category's frequency.

### Viewing Contact Details

1. Navigate to **Contacts**
2. Click **"View Details"** on any contact card
3. See all contact information including:
   - Contact details
   - Current category
   - Check-in history
4. From here you can:
   - Edit the contact
   - View check-in history
   - Delete the contact

### Searching Contacts

Use the search bar at the top of the Contacts page to find contacts by:
- Name (case-insensitive)
- Email address
- Phone number

The list updates as you type.

### Deleting a Contact

1. Navigate to **Contacts**
2. Click **"View Details"** on the contact
3. Click **"Delete Contact"** at the bottom
4. Confirm deletion

**Warning**: Deleting a contact also deletes all associated check-ins. This action cannot be undone (unless you restore from a backup).

---

## Managing Categories

### What Are Categories?

Categories help you organize contacts by relationship type and automatically determine check-in frequency. For example:

- **Family** - People you want to check in with weekly
- **Close Friends** - Monthly check-ins
- **Friends** - Quarterly check-ins
- **Professional** - Colleagues you check in with occasionally

### Creating a Category

1. Navigate to **Categories**
2. Click the **"Create Category"** button (+ icon)
3. Fill in the fields:
   - **Name** (required, e.g., "Mentors", "College Friends")
   - **Check-in Frequency** (required)
     - Enter a number (1-365)
     - Select a unit: Days, Weeks, Months, or Years
     - Examples: "2 Weeks", "3 Months", "1 Year"
4. Click **"Save"**

### Editing a Category

1. Navigate to **Categories**
2. Click the **"Edit"** button on any category card
3. Update the name or frequency
4. Click **"Save"**

**Note**: Changing a category's frequency will affect future check-ins for all contacts in that category. Existing scheduled check-ins are not automatically rescheduled.

### Deleting a Category

1. Navigate to **Categories**
2. Click the **"Delete"** button on any category card
3. Confirm deletion

**Warning**: You cannot delete a category if it has contacts assigned to it. First reassign those contacts to another category, then delete.

### Restoring Default Categories

If you delete the default categories and want them back:

1. Navigate to **Categories**
2. Click **"Restore Defaults"** at the top
3. The four default categories will be restored:
   - Family (Weekly)
   - Close Friends (Monthly)
   - Friends (Quarterly)
   - Professional (Quarterly)

---

## Check-in System

### Understanding Check-ins

The app automatically schedules check-ins for your contacts based on their category's frequency. Check-ins have three states:

- **Upcoming** - Scheduled for a future date
- **Today** - Due today
- **Overdue** - Past the scheduled date and not completed

### Viewing Check-ins

Navigate to **Check-ins** to see all your check-ins with options to:
- **Filter by status**: All, Upcoming, Overdue, Completed
- **Sort by**: Date, Contact Name, Status
- **Search**: Find check-ins by contact name

### Completing a Check-in

When you've contacted someone:

1. Find the check-in in the **Dashboard** or **Check-ins** page
2. Click the **"Complete"** button (checkmark icon)
3. Optionally add notes about the conversation
4. Click **"Complete Check-In"**

**What happens next**:
- The check-in is marked complete with the current date
- A new check-in is automatically scheduled based on the **original scheduled date** (not the completion date)
- Example: If a weekly check-in was due Monday but completed Wednesday, the next check-in will be scheduled for next Monday (not next Wednesday)

### Rescheduling a Check-in

If you need to postpone a check-in:

1. Find the check-in in the **Dashboard** or **Check-ins** page
2. Click the **"Reschedule"** button (calendar icon)
3. Select a new date
4. Optionally add a reason
5. Click **"Reschedule"**

The check-in will be moved to the new date.

### Creating Manual Check-ins

Need to schedule an ad-hoc check-in outside the regular schedule?

1. Navigate to **Check-ins**
2. Click **"Create Check-In"** at the top
3. Select a contact from the dropdown
4. Choose a scheduled date
5. Optionally add notes
6. Click **"Create"**

**Important**: Manual check-ins don't affect the regular schedule. When you complete a manual check-in, it won't create a new scheduled check-in.

### Viewing Check-in History

To see all past check-ins for a contact:

1. Navigate to **Contacts**
2. Click **"View Details"** on the contact
3. Click **"View History"**
4. See a list of all completed check-ins with:
   - Scheduled date
   - Completion date
   - Notes (if any)

---

## Dashboard Overview

The Dashboard is your command center for staying on top of check-ins.

### Summary Stats

At the top, you'll see four key metrics:

1. **Overdue Check-ins** - How many check-ins are past due (red)
2. **Due Today** - Check-ins scheduled for today (orange)
3. **Upcoming** - Check-ins in the next 7 days (blue)
4. **Total Contacts** - Total number of contacts in your system

### Today's Check-ins

Shows all check-ins due today with:
- Contact name
- Category
- Scheduled time
- Quick actions: Complete or Reschedule

### Overdue Check-ins

**High priority!** These are check-ins past their scheduled date.

- Displayed in red for urgency
- Shows how long they've been overdue
- Quick actions to complete or reschedule

### Upcoming Check-ins

Shows check-ins in the next 7 days:
- Sorted by date (soonest first)
- Contact name and category
- Scheduled date
- Quick actions available

### Quick Actions

From the Dashboard, you can:
- **Complete** a check-in with one click
- **Reschedule** a check-in to a new date
- **View all check-ins** - Link to the Check-ins page

---

## Notifications

### Browser Notifications

The app can send browser notifications to remind you about check-ins.

### Enabling Notifications

On first launch:
1. The app will request notification permission
2. Click **"Allow"** in your browser's permission prompt
3. Notifications are now enabled

To enable later:
1. Navigate to **Settings**
2. Find the **Notifications** section
3. Click **"Enable Browser Notifications"**
4. Allow permission in the browser prompt

### What Triggers Notifications

You'll receive notifications for:

- **Overdue check-ins** when you open the app
- **Today's check-ins** when you open the app
- **Background checks** (every 6 hours while app is open)

### Notification Format

Each notification shows:
- Contact name
- Category
- How long it's been overdue (if applicable)

Example:
```
Overdue Check-in
John Smith (Family) - 2 days overdue
```

### Disabling Notifications

1. Navigate to **Settings**
2. Find the **Notifications** section
3. Click **"Disable Notifications"**

Or manage browser permissions in your browser settings.

### Email Notifications (Future)

Currently, email notifications are simulated (logged to console). Real email integration is planned for a future release.

---

## Data Management

### Exporting Data

#### Export All Data as JSON

1. Navigate to **Settings**
2. Find the **Data Export** section
3. Click **"Export as JSON"**
4. A file named `contact-checkin-export-[timestamp].json` will download

This exports:
- All contacts
- All categories
- All check-ins
- Metadata (version, timestamp)

#### Export Contacts as CSV

1. Navigate to **Settings**
2. Find the **Data Export** section
3. Click **"Export Contacts as CSV"**
4. A file named `contacts-export-[timestamp].csv` will download

This exports only contact information in CSV format, useful for importing into other tools.

### Importing Data

**Warning**: Importing data will replace all existing data. Export your current data first if you want to keep it!

1. Navigate to **Settings**
2. Find the **Data Import** section
3. Click **"Choose File"** and select a JSON export file
4. Click **"Import Data"**
5. The app will validate the file
6. If valid, your data will be restored
7. The page will refresh

### Automatic Backups

The app automatically creates backups:

- When you import data
- When you manually create a backup

#### Creating a Manual Backup

1. Navigate to **Settings**
2. Find the **Backup** section
3. Click **"Create Backup Now"**
4. A timestamped JSON file will download

Store these backups somewhere safe (e.g., cloud storage, external drive).

### Data Storage

All your data is stored locally in your browser's LocalStorage:

- **Private**: Data never leaves your device
- **Offline-first**: Works without an internet connection
- **Browser-specific**: Data is tied to the browser and profile you're using

**Important**: Clearing browser data will delete your contacts and check-ins! Always keep backups.

### Switching Browsers or Devices

To move your data to a new browser or device:

1. **Export** data from the old browser (JSON format)
2. **Install/open** the app in the new browser
3. **Import** the JSON file

---

## Tips & Best Practices

### Getting Started

1. **Start small**: Add your closest contacts first (family, best friends)
2. **Use default categories**: They're a good starting point
3. **Enable notifications**: Don't miss important check-ins
4. **Export data regularly**: Create weekly or monthly backups

### Organizing Contacts

1. **Use meaningful categories**: Create categories that reflect your relationships
   - Example: "Mentors", "College Friends", "Former Colleagues"
2. **Adjust frequencies**: Not all "Friends" need quarterly check-ins
   - Create "Close Friends" (monthly) vs "Friends" (quarterly)
3. **Add relationship context**: Note how you know each person
4. **Include important dates**: Birthdays, anniversaries, work anniversaries

### Managing Check-ins

1. **Check daily**: Review your Dashboard each morning
2. **Handle overdue first**: Prioritize overdue check-ins (they're red for a reason!)
3. **Add notes**: Record what you discussed, making the next call easier
4. **Reschedule proactively**: If you know you can't check in on time, reschedule early
5. **Use manual check-ins**: For spontaneous calls or messages

### Staying Consistent

1. **Set a routine**: Check the Dashboard at the same time daily (e.g., morning coffee)
2. **Batch similar check-ins**: Group calls by category or timezone
3. **Start conversations**: Notes from previous check-ins are great conversation starters
4. **Celebrate progress**: Watch your completed check-ins grow!

### Data Safety

1. **Export monthly**: Create backups at least once a month
2. **Store backups safely**: Use cloud storage (Dropbox, Google Drive, iCloud)
3. **Test imports**: Occasionally test that your backups work
4. **Before browser cleanup**: Always export data before clearing browser data

---

## Troubleshooting

### Notifications Not Working

**Problem**: Not receiving browser notifications

**Solutions**:
1. Check notification permission in browser settings
2. Ensure notifications aren't blocked for the site
3. Re-enable notifications in **Settings**
4. Check browser notification settings (Do Not Disturb, Focus modes)

### Data Not Saving

**Problem**: Changes aren't persisting after refresh

**Solutions**:
1. Check browser's LocalStorage quota isn't exceeded
2. Ensure private/incognito mode isn't preventing storage
3. Try a different browser
4. Export data, clear browser storage, import data back

### Missing Contacts or Check-ins

**Problem**: Data disappeared

**Possible causes**:
1. Browser data was cleared
2. Using a different browser or profile
3. Data corruption (rare)

**Solutions**:
1. Import from your most recent backup
2. If no backup, data cannot be recovered

### Import Failing

**Problem**: Import shows an error

**Solutions**:
1. Verify the file is a valid JSON export from this app
2. Check the file isn't corrupted (open in text editor)
3. Try exporting from the original source again
4. Contact support with the error message

### App Loading Forever

**Problem**: App shows loading screen indefinitely

**Solutions**:
1. Refresh the page (Ctrl+R or Cmd+R)
2. Clear browser cache and reload
3. Check browser console for errors (F12)
4. Try a different browser

### Check-ins Not Scheduling

**Problem**: New contacts don't have check-ins scheduled

**Solutions**:
1. Ensure the contact is assigned to a category
2. Check that the category has a valid frequency
3. Delete and re-create the contact
4. Check browser console for errors

### Performance Issues

**Problem**: App is slow with many contacts

**Current limits**:
- Designed for up to 500 contacts
- Performance may degrade with thousands of check-ins

**Solutions**:
1. Delete completed check-ins older than 6 months (future feature)
2. Archive old contacts you no longer check in with
3. Export data and start fresh with active contacts only

---

## Browser Compatibility

The app works best in modern browsers:

✅ **Fully Supported**:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

⚠️ **Partial Support**:
- Older browsers may work but aren't tested

❌ **Not Supported**:
- Internet Explorer

---

## Privacy & Security

### Your Data

- **Stored locally**: All data stays on your device
- **No tracking**: The app doesn't collect analytics or personal data
- **No account required**: No sign-up, no passwords, no servers
- **Offline-first**: Works without internet connection

### Sharing Data

- **Export control**: You control when and what to export
- **No automatic sync**: Data doesn't sync between devices
- **Manual transfer**: Use export/import to move data

---

## Getting Help

### Found a Bug?

Report issues at: [GitHub Issues](https://github.com/myturnyet/contact-checkin-app/issues)

### Feature Requests

Have an idea? Open a feature request on GitHub!

### Questions?

Check the documentation:
- [README.md](./README.md) - Technical overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture details

---

## Keyboard Shortcuts

Currently, the app doesn't have custom keyboard shortcuts, but standard browser shortcuts work:

- **Ctrl/Cmd + R**: Refresh the page
- **Ctrl/Cmd + F**: Find on page
- **Tab**: Navigate between form fields
- **Enter**: Submit forms
- **Escape**: Close modals

---

## Version History

### Current Version: 1.0 (MVP)

**Features**:
- Contact management
- Category management
- Check-in tracking
- Browser notifications
- Data export/import
- Automatic backups
- Responsive design

**Coming Soon**:
- Service Worker (true offline support)
- Real email notifications
- Calendar integration
- Progressive Web App (install to home screen)

---

**Happy check-ins!** 📞 Stay connected with the people who matter most.
