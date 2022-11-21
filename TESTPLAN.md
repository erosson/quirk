# Manual test plan

After big changes, test these things manually, in both ios and android:

* [ ] is saved data persisted from the old version?
* From the create-thought form:
  * [ ] create an empty thought
  * [ ] create a non-empty thought
  * [ ] select/deselect a distortion
  * [ ] open the help screen
* From the help screen:
  * [ ] view the onboarding screen
  * [ ] ios: enable reminders from the onboarding screen 
* from the finished-thought screen:
  * [ ] edit the thought
  * [ ] close the thought and view the list
  * [ ] open a feedback email
* from the list of thoughts:
  * [ ] view a thought
  * [ ] delete a thought
  * [ ] delete the last thought, so the list is empty
  * [ ] open the settings screen
* from the settings screen:
  * [ ] enable a lock code. close and reopen the app, enter the code
  * [ ] update a lock code. close and reopen the app, verify code changed
  * [ ] clear the lock code. close and reopen the app, verify it's gone
  * [ ] change + verify the language
  * [ ] change + verify the history button labels
  * [ ] open the debug screen

last updated 2022/11/20

last run 2022/11/20
