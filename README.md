
# Divvy
## Send modules to the browser as code.

**This project is mostly for my personal use. If someone decides that they want to use this module it is publicly available. You can use it at your own risk. For now you should consider this module experimental, and it's interface may change in the future.**

**Being that Divvy serves a purpose shared by tools like Browserfiy it will work only in certain situations, and may not work for your use case. Divvy is not meant to replace other tools. You should use what fits your use case, what works, or what you like to use. Divvy is just another option.**

## Explanation

I've grappled with the idea of using scripts both server side, and client side. There are some basic things one can do.

* Have two files.
  1. One for the client.
  2. One for the server.
* Add to exports in node, or window in the browser.
  1. Use a check to see if node is the environment.
  2. Check if the browser is the environment.
* Use two totally different scripts for the same purpose in both environments.
* Use a tool like browserify.
* Don't use Javascript in the server.
* Don't use Javascript in the browser.

Some of the above are non-solutions. Others are solutions that are used frequently enough to almost be standard/best practices. I'll let you decide which is which.

Divvy is a module that fulfills that need for reducing repetition for what seems common methods used to accomplish browser, or server compatibilty. It brings it's interface to the module, and application level to accompish this.

## A Warning

Node has it's special code. This special code relies on compiled C++ to accomplish what javascript can't do. If a module relies on those C++ codes it will not work with Divvy. You should see undefined errors for those modules that do use C++. In some cases you may be able to replace those modules with a paritally compatible browser implementaion.

Node has a lot of modules that can work in the browser already. The purpose of Divvy isn't to support those modules. Maybe in the future there can be a flag that a developer can set to allow Divvy support, or some other method can be used to make modules compatible.

For now Divvy can be used to load scripts that are modules using Divvy methods. The documentation explains how this can be accompished for a module.

## Documentation


