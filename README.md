# twitterBot

**(Gavin the Friendly Twitter Bot)[https://twitter.com/GavinTheBot]** - A twitter bot that tweets friendly tweets to random users. Built in NodeJS with (Twit)[https://www.npmjs.com/package/twit].

This page will help us get started with the few simple commands we'll need to deploy my Twitter Bot, Gavin, to Heroku.

Getting Started
---------------

1. Fork the project

1. Check it out from GitHub

    ```sh
    git clone https://github.com/username/twitterBot
    ```

2. Install Heroku Command Line Toolbelt:

    https://devcenter.heroku.com/articles/heroku-command-line#download-and-install

3. Setup Remote at Heroku one time only

    ```sh
    heroku git:remote -a username
    ```

Committing it to Github
-----------------------
This is the normal commands when working on the bot code

1. Always pull before push when working with others

    ```sh
    git pull origin master
    ```

2. See what changes you've made:

    ```sh
    git status
    ```

3. When you are at a good point to save your work locally, commit to Local Repo

    ```sh
    git commit -a -m "good description of your changes goes here"
    ```
    <sup>You can also type "git add -A" to add all new files to the commit, but you still need to type "git commit"</sup>

4. When you want to save it permanently to Github

    ```sh
    git push origin master
    ```

5. When you want to publish it

    ```sh
    git push heroku master
    ```

6. Check the status of your server

    ```sh
    heroku logs -t
    ```

7. Visit the Bot!

https://twitter.com/GavinTheBot

[Twit]:https://www.npmjs.com/package/twit
[Gavin the Friendly Twitter Bot]:https://twitter.com/GavinTheBot

