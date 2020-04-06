FROM gitpod/workspace-full

USER root

RUN npm i
RUN npm i -g nodemon
RUN npm install forever -g
RUN npm install -g npm-check-updates
RUN npm install -g firebase-tools
RUN apt-get update && apt-get install -y \
    software-properties-common
RUN chmod -R 777 ~/.config
RUN chmod -R 777 ~/.npm

RUN apt-get install htop -y
RUN apt-get install zsh -y 