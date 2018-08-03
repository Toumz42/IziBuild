// The Play plugin
addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.6.12")

// Web plugins
//addSbtPlugin("com.typesafe.sbt" % "sbt-coffeescript" % "1.0.1")
addSbtPlugin("com.typesafe.sbt" % "sbt-jshint" % "1.0.6")
addSbtPlugin("com.typesafe.sbt" % "sbt-rjs" % "1.0.8")
addSbtPlugin("com.typesafe.sbt" % "sbt-digest" % "1.1.1")
addSbtPlugin("com.typesafe.sbt" % "sbt-mocha" % "1.1.0")
addSbtPlugin("org.irundaia.sbt" % "sbt-sassify" % "1.4.12")
//addSbtPlugin("com.typesafe.sbt" % "sbt-play-ebean" % "3.0.0")
addSbtPlugin("com.payintech" % "sbt-play-ebean" % "18.03")
addSbtPlugin("io.get-coursier" % "sbt-coursier" % "1.0.3")



// Play enhancer - this automatically generates getters/setters for public fields
// and rewrites accessors of these fields to use the getters/setters. Remove this
// plugin if you prefer not to have this feature, or disable on a per project
// basis using disablePlugins(PlayEnhancer) in your build.sbt
addSbtPlugin("com.typesafe.sbt" % "sbt-play-enhancer" % "1.1.0")
