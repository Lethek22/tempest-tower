namespace SpriteKind {
    export const Camman = SpriteKind.create()
    export const Curso = SpriteKind.create()
    export const Decor = SpriteKind.create()
    export const Door = SpriteKind.create()
    export const Deth = SpriteKind.create()
    export const Drop = SpriteKind.create()
}
/**
 * WeaponInvis?
 * 
 * Melee?
 * 
 * AtkImage
 * 
 * AtkFatal?
 * 
 * Damage
 * 
 * Knockback
 * 
 * Lifespan
 * 
 * Reload
 * 
 * AttackGhost?
 * 
 * AtkX-Int
 * 
 * AtkY-Int
 * 
 * MausX
 * 
 * MausY
 * 
 * Anims_1-6
 */
sprites.onCreated(SpriteKind.Enemy, function (sprite) {
    timer.after(600, function () {
        sprites.setDataBoolean(sprite, "Invincible?", false)
        sprites.setDataBoolean(sprite, "Fatal?", true)
        if (sprites.readDataNumber(sprite, "Ident") == 2) {
            while (sprites.readDataNumber(sprite, "HP") > 0) {
                if (Math.abs(mySprite.x - sprite.x) <= 48 && Math.abs(mySprite.y - sprite.y) <= 48 || sprites.readDataBoolean(sprite, "Alert?")) {
                    if (sprite.image.equals(assets.image`Enemy2`)) {
                        animation.runImageAnimation(
                        sprite,
                        assets.animation`Enemy2Chase`,
                        100,
                        true
                        )
                    }
                    if (Math.abs(mySprite.x - sprite.x) <= 48 && Math.abs(mySprite.y - sprite.y) <= 48) {
                        sprites.setDataBoolean(sprite, "Alert?", false)
                    }
                    sprite.fx = 0
                    sprite.fy = 0
                    ProjTrackII(sprite, mySprite.x, mySprite.y, (Math.abs(sprite.vx) + Math.abs(sprite.vy)) / 2 + 20)
                } else {
                    animation.stopAnimation(animation.AnimationTypes.All, sprite)
                    sprite.setImage(assets.image`Enemy2`)
                    sprite.fx = 50
                    sprite.fy = 50
                }
                pause(200)
            }
        }
    })
})
function Atk (WInvis: boolean, Melee: boolean, AImage: Image, AFatal: boolean, Dmg: number, KB: number, LifeSp: number, Reload: number, AGhost: boolean, AXInt: number, AYInt: number, MouseX: number, MouseY: number, Anim1: any[], Anim2: any[], Anim3: any[], Anim4: any[], Anim5: any[], Anim6: any[]) {
    Weapon.setFlag(SpriteFlag.Invisible, WInvis)
    sprites.setDataBoolean(mySprite, "Melee?", Melee)
    sprites.setDataBoolean(mySprite, "Reloaded?", false)
    Attack = sprites.create(AImage, SpriteKind.Projectile)
    Attack.z = 3
    sprites.setDataBoolean(Attack, "Fatal?", AFatal)
    sprites.setDataNumber(Attack, "Damage", Dmg)
    sprites.setDataNumber(Attack, "Knockback", KB)
    Attack.lifespan = LifeSp
    Attack.setFlag(SpriteFlag.GhostThroughWalls, AGhost)
    Attack.setPosition(mySprite.x + AXInt, mySprite.y + AYInt)
    if (mySprite.x - (scene.cameraProperty(CameraProperty.Left) + MouseX) <= 0) {
        animation.runImageAnimation(
        Attack,
        Anim1,
        100,
        false
        )
        animation.runImageAnimation(
        Weapon,
        Anim2,
        100,
        false
        )
        animation.runImageAnimation(
        mySprite,
        Anim3,
        100,
        false
        )
    } else {
        animation.runImageAnimation(
        Attack,
        Anim4,
        100,
        false
        )
        animation.runImageAnimation(
        Weapon,
        Anim5,
        100,
        false
        )
        animation.runImageAnimation(
        mySprite,
        Anim6,
        100,
        false
        )
    }
    timer.after(LifeSp - 50, function () {
        Weapon.setFlag(SpriteFlag.Invisible, false)
    })
    timer.after(Reload, function () {
        Weapon.setFlag(SpriteFlag.Invisible, false)
        sprites.setDataBoolean(mySprite, "Melee?", false)
        sprites.setDataBoolean(mySprite, "Reloaded?", true)
        sprites.setDataString(mySprite, "State", "Idle")
    })
}
function Enemies (HP: number, KnockBackRes: number, Ident: number, Damage: number, Sprite2: Sprite) {
    sprites.setDataNumber(Enemy1, "HP", HP)
    sprites.setDataNumber(Enemy1, "KBResistence", KnockBackRes)
    sprites.setDataNumber(Enemy1, "Ident", Ident)
    sprites.setDataNumber(Enemy1, "Damage", Damage)
    sprites.setDataNumber(Enemy1, "Attacking", 0)
    sprites.setDataBoolean(Enemy1, "Fatal?", false)
    sprites.setDataBoolean(Enemy1, "Invincible?", true)
    sprites.setDataBoolean(Enemy1, "Mark", sprites.readDataBoolean(mySprite, "Mark"))
    if (sprites.readDataBoolean(Enemy1, "Mark")) {
        ListStorage[8] = ListStorage[8] + 1
    }
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`BackBrick11`, function (sprite, location) {
    for (let value of tiles.getTilesByType(assets.tile`BackBrick11`)) {
        tiles.setTileAt(value, assets.tile`BackBrick1`)
    }
    for (let value of tiles.getTilesByType(assets.tile`BackBrick10`)) {
        tiles.setTileAt(value, assets.tile`BackBrick12`)
        tiles.setWallAt(value, true)
    }
    sprites.setDataBoolean(mySprite, "Mark", true)
    Summoner(1, assets.tile`BackBrick14`, assets.tile`BackBrick1`)
    Summoner(2, assets.tile`BackBrick13`, assets.tile`BackBrick3`)
    timer.after(500, function () {
        sprites.setDataBoolean(mySprite, "Mark", false)
    })
})
function ProjTrackII (Projectile: Sprite, TargetX: number, TargetY: number, Speed: number) {
    Projectile.setVelocity((TargetX - Projectile.x) / Math.sqrt((TargetX - Projectile.x) ** 2 + (TargetY - Projectile.y) ** 2) * Speed, (TargetY - Projectile.y) / Math.sqrt((TargetX - Projectile.x) ** 2 + (TargetY - Projectile.y) ** 2) * Speed)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Drop, function (sprite, otherSprite) {
    if (browserEvents.Q.isPressed()) {
        if (sprites.readDataNumber(mySprite, "Weapon") == sprites.readDataNumber(mySprite, "WeaponASlot")) {
            sprites.setDataNumber(mySprite, "WeaponASlot", sprites.readDataNumber(otherSprite, "Ident"))
        } else if (sprites.readDataNumber(mySprite, "Weapon") == sprites.readDataNumber(mySprite, "WeaponBSlot")) {
            sprites.setDataNumber(mySprite, "WeaponBSlot", sprites.readDataNumber(otherSprite, "Ident"))
        }
        sprites.setDataNumber(mySprite, "Weapon", sprites.readDataNumber(otherSprite, "Ident"))
        WeaponHoldImgs([
        assets.image`Weapon1`,
        assets.image`Weapon2`,
        assets.image`Weapon3`,
        assets.image`Weapon4`,
        assets.image`Weapon5`,
        assets.image`Weapon6`,
        assets.image`Weapon7`,
        assets.image`Weapon8`,
        assets.image`Weapon9`,
        assets.image`Weapon10`,
        assets.image`Weapon11`,
        assets.image`Weapon12`,
        assets.image`Weapon13`,
        assets.image`Weapon14`,
        assets.image`Weapon15`,
        assets.image`Weapon16`
        ], "Weapon", Weapon, mySprite)
        sprites.destroy(otherSprite)
    }
})
function XChamberNum () {
    tiles.placeOnRandomTile(mySprite, assets.tile`BackBrick0`)
    Decoration = sprites.create(assets.image`GateO`, SpriteKind.Door)
    Decoration.setFlag(SpriteFlag.GhostThroughWalls, true)
    tiles.placeOnRandomTile(Decoration, assets.tile`BackBrick0`)
    Decoration = sprites.create(assets.image`GateC`, SpriteKind.Door)
    Decoration.setFlag(SpriteFlag.GhostThroughWalls, true)
    tiles.placeOnRandomTile(Decoration, assets.tile`BackBrick7`)
    Flood = sprites.create(assets.image`Flood`, SpriteKind.Deth)
    Flood.setFlag(SpriteFlag.GhostThroughWalls, true)
    Flood.vy = -6
    tiles.placeOnTile(Flood, tiles.getTileLocation(0, mySprite.tilemapLocation().row + 15))
}
controller.player2.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed, function () {
    tiles.placeOnRandomTile(CameraSpr, assets.tile`BackBrick7`)
})
function WeaponHoldImgs (Imgs: any[], Input: string, Subject: Sprite, SubjectB: Sprite) {
    for (let index = 0; index <= Imgs.length - 1; index++) {
        if (sprites.readDataNumber(SubjectB, Input) == index + 1) {
            Subject.setImage(Imgs[index])
        }
    }
}
sprites.onOverlap(SpriteKind.Camman, SpriteKind.Door, function (sprite, otherSprite) {
    otherSprite.setKind(SpriteKind.Decor)
    if (otherSprite.image.equals(assets.image`GateO`)) {
        timer.after(1000, function () {
            sprites.setDataBoolean(mySprite, "CanMove?", true)
            animation.runImageAnimation(
            otherSprite,
            assets.animation`GateClosing`,
            100,
            false
            )
        })
    } else {
        sprites.setDataBoolean(mySprite, "Invincible?", true)
        sprites.setDataBoolean(mySprite, "CanMove?", false)
        animation.runImageAnimation(
        otherSprite,
        assets.animation`GateOpening`,
        100,
        false
        )
        timer.after(500, function () {
            mySprite.vx = 0
            animation.stopAnimation(animation.AnimationTypes.All, mySprite)
            if (sprites.readDataNumber(mySprite, "FacingLeft?") == 1) {
                animation.runImageAnimation(
                mySprite,
                assets.animation`IsolIdleLeft`,
                200,
                true
                )
            } else {
                animation.runImageAnimation(
                mySprite,
                assets.animation`IsolIdleRight`,
                200,
                true
                )
            }
            color.FadeToBlack.startScreenEffect(1000)
            timer.after(1500, function () {
                Overview(true)
                pauseUntil(() => browserEvents.MouseLeft.isPressed())
                Epilogue.vy = 49
                Epilogue.ay = -50
                Module.vy = 49
                Module.ay = -50
                timer.after(1000, function () {
                    Module.ay = 0
                    Module.vy = 0
                    if (ListMod[ListStorage[1] - 1] >= 0) {
                        Module = sprites.create(assets.image`Module2`, SpriteKind.Decor)
                        animation.runImageAnimation(
                        Module,
                        assets.animation`ModAscend`,
                        100,
                        false
                        )
                    } else {
                        Module = sprites.create(assets.image`Peak`, SpriteKind.Decor)
                        animation.runImageAnimation(
                        Module,
                        assets.animation`PeakAscend`,
                        100,
                        false
                        )
                        Module = sprites.create(assets.image`RedC`, SpriteKind.Decor)
                        if (ListMod[ListStorage[1] - 1] == -1) {
                            color.setColor(4, color.rgb(128, 0, 0))
                            animation.runImageAnimation(
                            Module,
                            assets.animation`RedCFlame`,
                            100,
                            false
                            )
                        } else if (ListMod[ListStorage[1] - 1] == -2) {
                            animation.runImageAnimation(
                            Module,
                            assets.animation`GreenCShine`,
                            100,
                            false
                            )
                        } else if (ListMod[ListStorage[1] - 1] == -3) {
                            color.setColor(6, color.rgb(0, 50, 196))
                            animation.runImageAnimation(
                            Module,
                            assets.animation`BlueCWater`,
                            100,
                            false
                            )
                        }
                    }
                    Epilogue.top = 0
                    Epilogue.vy = 0
                    Epilogue.ay = 0
                    timer.after(800, function () {
                        color.FadeToBlack.startScreenEffect(1000)
                        timer.after(1200, function () {
                            sprites.destroyAllSpritesOfKind(SpriteKind.Decor)
                            mySprite.setFlag(SpriteFlag.Invisible, false)
                            Weapon.setFlag(SpriteFlag.Invisible, false)
                            mySprite.ay = 500
                            sprites.setDataBoolean(mySprite, "Invincible?", false)
                            sprites.changeDataNumberBy(mySprite, "HP", 50)
                            if (sprites.readDataNumber(mySprite, "HP") > 100) {
                                sprites.setDataNumber(mySprite, "HP", 100)
                            }
                            ListStorage[0] = 0
                            for (let index = 0; index <= 4; index++) {
                                ListStorage[3 + index] = 0
                            }
                            ListStorage[10] = ListMod[ListStorage[1] - 1]
                            if (ListStorage[10] == 2) {
                                tiles.setCurrentTilemap(tilemap`TowerA2`)
                            } else if (ListStorage[10] == 3) {
                                tiles.setCurrentTilemap(tilemap`TowerA3`)
                            } else if (ListStorage[10] == 4) {
                                tiles.setCurrentTilemap(tilemap`TowerA4`)
                            } else if (ListStorage[10] == 5) {
                                tiles.setCurrentTilemap(tilemap`TowerA5`)
                            } else if (ListStorage[10] == 6) {
                                tiles.setCurrentTilemap(tilemap`TowerA6`)
                            } else if (ListStorage[10] == 7) {
                                tiles.setCurrentTilemap(tilemap`TowerA7`)
                            } else {
                            	
                            }
                            ListStorage[1] = ListStorage[1] + 1
                            EnemySpawn()
                            XChamberNum()
                            tiles.placeOnRandomTile(CameraSpr, assets.tile`BackBrick0`)
                            color.startFadeFromCurrent(color.originalPalette, 500)
                        })
                    })
                })
            })
        })
    }
})
function THETA () {
    color.setColor(6, color.rgb(0, 128, 64))
    color.setColor(7, color.rgb(0, 255, 128))
    color.setColor(9, color.rgb(0, 192, 96))
    color.setColor(10, color.rgb(0, 64, 32))
    color.setColor(15, color.rgb(0, 16, 8))
    scroller.setLayerImage(scroller.BackgroundLayer.Layer0, assets.image`THETA0`)
    scroller.scrollBackgroundWithSpeed(0, 15, scroller.BackgroundLayer.Layer0)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer1, assets.image`THETA1`)
    pause(1200)
    color.FadeToBlack.startScreenEffect(300)
    pause(500)
    scroller.scrollBackgroundWithSpeed(0, 0, scroller.BackgroundLayer.Layer0)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer0, assets.image`THETA0B`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer1, assets.image`THETA1B`)
    scroller.setBackgroundScrollOffset(0, 0, scroller.BackgroundLayer.Layer0)
    color.setPalette(
    color.originalPalette
    )
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    sprites.setDataNumber(mySprite, "FacingLeft?", 1)
})
function Texter (Icon: Image, Ident: number, X: number, Y: number, Left: boolean) {
    if (Ident == 5) {
        textSprite = textsprite.create("" + convertToText(Math.floor(ListStorage[Ident] / 60)) + ":" + convertToText(ListStorage[Ident] % 60), 0, 1)
    } else if (Ident == 6) {
        textSprite = textsprite.create("" + convertToText(Math.round(ListStorage[7] / ListStorage[6] * 100)) + "%", 0, 1)
    } else {
        textSprite = textsprite.create(convertToText(ListStorage[Ident]), 0, 1)
    }
    textSprite.setIcon(Icon)
    textSprite.setPosition(X, Y)
    textSprite.setKind(SpriteKind.Decor)
    if (Left) {
        textSprite.left = X
    } else {
        textSprite.right = X
    }
}
function Summoner (Ident: number, StartBlock: Image, EndBlock: Image) {
    if (Ident == 1) {
        for (let value of tiles.getTilesByType(StartBlock)) {
            Enemy1 = sprites.create(assets.image`EnemyTest`, SpriteKind.Enemy)
            Enemies(100, 50, 1, 8, Enemy1)
            Enemy1.fx = 25
            Enemy1.ay = 500
            sprites.setDataNumber(Enemy1, "Direction", -1)
            sprites.setDataNumber(Enemy1, "Speed", 25)
            animation.runImageAnimation(
            Enemy1,
            assets.animation`Enemy1-3Spawn`,
            100,
            false
            )
            tiles.placeOnTile(Enemy1, value)
            tiles.setTileAt(value, EndBlock)
        }
    } else if (Ident == 2) {
        for (let value of tiles.getTilesByType(StartBlock)) {
            Enemy1 = sprites.create(assets.image`Enemy2`, SpriteKind.Enemy)
            Enemies(75, 75, 2, 12, Enemy1)
            animation.runImageAnimation(
            Enemy1,
            assets.animation`Enemy2Spawn`,
            100,
            false
            )
            tiles.placeOnTile(Enemy1, value)
            tiles.setTileAt(value, EndBlock)
        }
    } else if (Ident == 3) {
        for (let value of tiles.getTilesByType(StartBlock)) {
            Enemy1 = sprites.create(assets.image`EnemyTest`, SpriteKind.Enemy)
            Enemies(100, 50, 3, 8, Enemy1)
            Enemy1.ay = 500
            sprites.setDataNumber(Enemy1, "Direction", 0)
            sprites.setDataNumber(Enemy1, "Speed", 25)
            Enemy1.fx = 25
            animation.runImageAnimation(
            Enemy1,
            assets.animation`Enemy1-3Spawn`,
            100,
            false
            )
            tiles.placeOnTile(Enemy1, value)
            tiles.setTileAt(value, EndBlock)
        }
    } else {
    	
    }
}
scene.onHitWall(SpriteKind.Enemy, function (sprite, location) {
    if (sprites.readDataBoolean(sprite, "Fatal?")) {
        if (sprites.readDataNumber(sprite, "Ident") == 1 || sprites.readDataNumber(sprite, "Ident") == 3) {
            if (sprites.readDataNumber(sprite, "Attacking") == 0) {
                sprite.vx = sprites.readDataNumber(sprite, "Speed") * sprites.readDataNumber(sprite, "Direction")
                if (sprites.readDataNumber(sprite, "Ident") == 3) {
                    sprites.setDataNumber(sprite, "Direction", 0)
                    if (mySprite.x - sprite.x < 0) {
                        animation.runImageAnimation(
                        sprite,
                        assets.animation`Enemy3L`,
                        500,
                        true
                        )
                    } else {
                        animation.runImageAnimation(
                        sprite,
                        assets.animation`Enemy3R`,
                        500,
                        true
                        )
                    }
                } else if (!(tiles.tileAtLocationIsWall(tiles.getTileLocation(sprite.tilemapLocation().column - 1, sprite.tilemapLocation().row + 1))) || tiles.tileAtLocationIsWall(tiles.getTileLocation(sprite.tilemapLocation().column - 1, sprite.tilemapLocation().row))) {
                    sprites.setDataNumber(sprite, "Direction", 1)
                    animation.runImageAnimation(
                    sprite,
                    assets.animation`Enemy1R`,
                    150,
                    true
                    )
                } else if (!(tiles.tileAtLocationIsWall(tiles.getTileLocation(sprite.tilemapLocation().column + 1, sprite.tilemapLocation().row + 1))) || tiles.tileAtLocationIsWall(tiles.getTileLocation(sprite.tilemapLocation().column + 1, sprite.tilemapLocation().row))) {
                    sprites.setDataNumber(sprite, "Direction", -1)
                    animation.runImageAnimation(
                    sprite,
                    assets.animation`Enemy1L`,
                    150,
                    true
                    )
                }
                if (Math.abs(mySprite.x - sprite.x) <= 32 && Math.abs(mySprite.y - sprite.y) <= 16 || sprites.readDataBoolean(sprite, "Alert?")) {
                    sprites.setDataBoolean(sprite, "Alert?", false)
                    if (mySprite.x - sprite.x > 0) {
                        sprites.setDataNumber(sprite, "Direction", 1)
                        animation.runImageAnimation(
                        sprite,
                        assets.animation`Enemy1AR`,
                        100,
                        false
                        )
                    } else {
                        sprites.setDataNumber(sprite, "Direction", -1)
                        animation.runImageAnimation(
                        sprite,
                        assets.animation`Enemy1AL`,
                        100,
                        false
                        )
                    }
                    sprites.setDataNumber(sprite, "Attacking", 1)
                    sprite.vx = 0
                    timer.after(250, function () {
                        sprite.vx = sprites.readDataNumber(sprite, "Speed") * sprites.readDataNumber(sprite, "Direction") * 4
                    })
                    timer.after(500, function () {
                        sprites.setDataNumber(sprite, "Attacking", 0)
                    })
                }
            }
        }
    } else {
        if (sprites.readDataBoolean(sprite, "Invincible?")) {
            sprites.setDataBoolean(sprite, "Invincible?", false)
            if (sprites.readDataNumber(sprite, "Ident") == 1 || sprites.readDataNumber(sprite, "Ident") == 3) {
                timer.after(600, function () {
                    sprites.setDataBoolean(sprite, "Fatal?", true)
                })
            }
        }
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    sprites.setDataNumber(mySprite, "FacingLeft?", 0)
})
function Death (Cause: string) {
    if (sprites.readDataNumber(mySprite, "HP") != 1000) {
        sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
        sprites.destroyAllSpritesOfKind(SpriteKind.Drop)
        sprites.destroyAllSpritesOfKind(SpriteKind.Drop)
        sprites.destroyAllSpritesOfKind(SpriteKind.Decor)
        Weapon.setFlag(SpriteFlag.Invisible, true)
        sprites.setDataBoolean(mySprite, "CanMove?", false)
        sprites.setDataBoolean(mySprite, "CanDash?", false)
        sprites.setDataBoolean(mySprite, "Reloaded?", false)
        sprites.setDataBoolean(mySprite, "Alert?", true)
        mySprite.ay = 50
        sprites.setDataNumber(mySprite, "HP", 1000)
        Flood.vy = 1
        mySprite.fx = 10
        animation.stopAnimation(animation.AnimationTypes.All, mySprite)
        mySprite.setVelocity(20, -50)
        mySprite.setImage(assets.image`IsolDead`)
        if (Cause == "Drown") {
            for (let index = 0; index <= 13; index++) {
                color.setColor(1 + index, color.rgb(0, 0, 80))
            }
        } else if (Cause == "EnemyB") {
            for (let index = 0; index <= 13; index++) {
                color.setColor(1 + index, color.rgb(196, 0, 0))
            }
        } else {
            for (let index = 0; index <= 13; index++) {
                color.setColor(1 + index, color.rgb(255, 255, 255))
            }
        }
        timer.after(50, function () {
            for (let value of tiles.getTilesByType(assets.tile`Brick1`)) {
                tiles.setTileAt(value, sprites.builtin.forestTiles10)
            }
            for (let value of tiles.getTilesByType(assets.tile`Floor1`)) {
                tiles.setTileAt(value, sprites.builtin.forestTiles10)
            }
            color.setColor(15, color.rgb(0, 0, 0))
            timer.after(1000, function () {
                color.FadeToBlack.startScreenEffect(1500)
                timer.after(2000, function () {
                    Overview(false)
                    pauseUntil(() => browserEvents.MouseLeft.isPressed())
                    color.FadeToBlack.startScreenEffect(1500)
                    timer.after(1500, function () {
                        game.reset()
                    })
                })
            })
        })
    }
}
browserEvents.onMouseMove(function (x, y) {
    sprites.setDataNumber(Cursor, "X", x)
    sprites.setDataNumber(Cursor, "Y", y)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Deth, function (sprite, otherSprite) {
    while (mySprite.y > Flood.top) {
        sprites.changeDataNumberBy(mySprite, "HP", -1)
        if (sprites.readDataNumber(mySprite, "HP") <= 0 || mySprite.y > Flood.y) {
            sprites.setDataNumber(mySprite, "HP", 0)
            Death("Drown")
        }
        pause(50)
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprites.readDataBoolean(mySprite, "CanDash?") && sprites.readDataBoolean(mySprite, "CanMove?")) {
        sprites.setDataBoolean(mySprite, "CanDash?", false)
        sprites.setDataBoolean(mySprite, "CanMove?", false)
        for (let index = 0; index <= 4; index++) {
            mySprite.vx = 400 - sprites.readDataNumber(mySprite, "FacingLeft?") * 800 - index * (80 - sprites.readDataNumber(mySprite, "FacingLeft?") * 160)
            pause(50)
        }
        sprites.setDataBoolean(mySprite, "CanMove?", true)
        mySprite.vx = 0
        timer.after(700, function () {
            sprites.setDataBoolean(mySprite, "CanDash?", true)
        })
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`BackBrick8`, function (sprite, location) {
    if (browserEvents.MouseLeft.isPressed()) {
        sprites.destroyAllSpritesOfKind(SpriteKind.Drop)
        tiles.setTileAt(location, assets.tile`myTile3`)
        ListStorage[7] = ListStorage[7] + 1
        ListStorage[3] = ListStorage[3] + 1
        DroppedItem = sprites.create(assets.image`Weapon1`, SpriteKind.Drop)
        tiles.placeOnTile(DroppedItem, location)
        DroppedItem.vy = -100
        DroppedItem.ay = 200
        DroppedItem.vx = randint(-40, 40)
        DroppedItem.fx = 30
        sprites.setDataNumber(DroppedItem, "Ident", randint(1, 16))
        WeaponHoldImgs([
        assets.image`Weapon1`,
        assets.image`Weapon2`,
        assets.image`Weapon3`,
        assets.image`Weapon4`,
        assets.image`Weapon5`,
        assets.image`Weapon6`,
        assets.image`Weapon7`,
        assets.image`Weapon8`,
        assets.image`Weapon9`,
        assets.image`Weapon10`,
        assets.image`Weapon11`,
        assets.image`Weapon12`,
        assets.image`Weapon13`,
        assets.image`Weapon14`,
        assets.image`Weapon15`,
        assets.image`Weapon16`
        ], "Ident", DroppedItem, DroppedItem)
    }
})
/**
 * Remove: 
 * 
 * p2 debug
 */
browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x, y) {
    if (ListStorage[0] == 0) {
        if (sprites.readDataBoolean(mySprite, "Reloaded?")) {
            ListStorage[6] = ListStorage[6] + 1
            if (sprites.readDataNumber(mySprite, "Weapon") == 1) {
                Atk(true, true, image.create(64, 64), true, 25, 30, 500, 600, true, 0, 0, x, y, assets.animation`StickR`, assets.animation`StickIR`, assets.animation`IsolMeleeRight`, assets.animation`StickL`, assets.animation`StickIL`, assets.animation`IsolMeleeLeft`)
            } else if (sprites.readDataNumber(mySprite, "Weapon") == 2) {
                Atk(false, false, assets.image`TestProj`, true, 12, 5, 1000, 300, false, 0, 5, x, y, assets.animation`NerfR`, assets.animation`BlasterR`, assets.animation`IsolShootRight`, assets.animation`NerfL`, assets.animation`BlasterL`, assets.animation`IsolShootLeft`)
                ProjTrackII(Attack, x + scene.cameraProperty(CameraProperty.Left), y + scene.cameraProperty(CameraProperty.Top), 125)
            } else if (sprites.readDataNumber(mySprite, "Weapon") == 3) {
                Atk(true, true, image.create(80, 24), true, 40, 40, 600, 900, true, 0, 0, x, y, assets.animation`WhipR`, assets.animation`WhipIR`, assets.animation`IsolMelee2Right`, assets.animation`WhipL`, assets.animation`WhipIL`, assets.animation`IsolMelee2Left`)
            } else if (sprites.readDataNumber(mySprite, "Weapon") == 4) {
                Atk(false, false, assets.image`TestProj`, true, 8, 0, 1000, 200, false, 0, 5, x, y, assets.animation`LaserR`, assets.animation`LaserIR`, assets.animation`IsolShootRight`, assets.animation`LaserL`, assets.animation`LaserIL`, assets.animation`IsolShootLeft`)
                ProjTrackII(Attack, x + scene.cameraProperty(CameraProperty.Left), y + scene.cameraProperty(CameraProperty.Top), 150)
            } else if (sprites.readDataNumber(mySprite, "Weapon") == 5) {
                if (Math.abs(x + scene.cameraProperty(CameraProperty.Left) - mySprite.x) <= 32 && Math.abs(y + scene.cameraProperty(CameraProperty.Top) - mySprite.y) <= 32) {
                    Atk(true, true, image.create(48, 16), true, 35, 25, 500, 700, true, 0, 0, x, y, assets.animation`BayonetMR`, assets.animation`BayonetRIR`, assets.animation`IsolShootRight`, assets.animation`BayonetML`, assets.animation`BayonetRIL`, assets.animation`IsolShootLeft`)
                } else {
                    Atk(false, false, assets.image`TestProj`, true, 25, 8, 1000, 1000, false, 0, 5, x, y, assets.animation`Bullet`, assets.animation`BayonetRIR`, assets.animation`IsolShootRight`, assets.animation`Bullet`, assets.animation`BayonetRIL`, assets.animation`IsolShootLeft`)
                    ProjTrackII(Attack, x + scene.cameraProperty(CameraProperty.Left), y + scene.cameraProperty(CameraProperty.Top), 200)
                }
            } else if (sprites.readDataNumber(mySprite, "Weapon") == 6) {
                Atk(false, false, assets.image`TestProj`, true, 20, 15, 1200, 600, false, 0, 0, x, y, assets.animation`Lobber`, assets.animation`LobberIR`, assets.animation`IsolMelee2Right`, assets.animation`Lobber`, assets.animation`LobberIL`, assets.animation`IsolMelee2Left`)
                ProjTrackII(Attack, x + scene.cameraProperty(CameraProperty.Left), y + scene.cameraProperty(CameraProperty.Top), 175)
                Attack.ay = 300
            } else if (sprites.readDataNumber(mySprite, "Weapon") == 7) {
                Atk(true, true, image.create(64, 64), true, 40, 40, 700, 600, true, 0, 0, x, y, assets.animation`TorchR`, assets.animation`TorchIR`, assets.animation`IsolMeleeRight`, assets.animation`TorchL`, assets.animation`TorchIL`, assets.animation`IsolMeleeLeft`)
            } else if (sprites.readDataNumber(mySprite, "Weapon") == 8) {
                for (let index = 0; index < 5; index++) {
                    Atk(false, false, assets.image`TestProj`, true, 15, 12, 1000, 1100, false, 0, 3, x, y, assets.animation`Shotgun`, assets.animation`ShotgunIR`, assets.animation`IsolShootRight`, assets.animation`Shotgun`, assets.animation`ShotgunIL`, assets.animation`IsolShootLeft`)
                    ProjTrackII(Attack, x + scene.cameraProperty(CameraProperty.Left) + randint(-20, 20), y + scene.cameraProperty(CameraProperty.Top) + randint(-20, 20), randint(150, 225))
                }
            } else if (sprites.readDataNumber(mySprite, "Weapon") == 9) {
                Atk(true, true, image.create(32, 16), true, 15, 5, 300, 250, true, 0, 0, x, y, assets.animation`DaggerR`, assets.animation`DaggerIR`, assets.animation`IsolMeleeRight`, assets.animation`DaggerL`, assets.animation`DaggerIL`, assets.animation`IsolMeleeLeft`)
            } else if (sprites.readDataNumber(mySprite, "Weapon") == 10) {
                Atk(false, false, image.create(56, 56), true, 60, 75, 3000, 3000, false, 0, -10, x, y, assets.animation`CinderR`, assets.animation`CinderIR`, assets.animation`IsolThrowRight`, assets.animation`CinderL`, assets.animation`CinderIL`, assets.animation`IsolThrowLeft`)
                Attack.setFlag(SpriteFlag.Invisible, true)
                timer.after(800, function () {
                    Attack.setPosition(mySprite.x + (sprites.readDataNumber(mySprite, "FacingLeft?") * 2 - 1) * -10, mySprite.y - 10)
                    Attack.setFlag(SpriteFlag.Invisible, false)
                    Weapon.setFlag(SpriteFlag.Invisible, true)
                    ProjTrackII(Attack, Cursor.x, Cursor.y, 150)
                })
            } else if (sprites.readDataNumber(mySprite, "Weapon") == 11) {
                Atk(true, true, image.create(80, 48), true, 30, 0, 500, 500, true, 0, 0, x, y, assets.animation`SwordR`, assets.animation`SwordIR`, assets.animation`IsolMeleeRight`, assets.animation`SwordL`, assets.animation`SwordIL`, assets.animation`IsolMeleeLeft`)
            } else if (sprites.readDataNumber(mySprite, "Weapon") == 12) {
                Atk(false, false, assets.image`TestProj`, true, 20, 25, 3000, 750, false, 0, -2, x, y, assets.animation`Lobster`, assets.animation`LobsterIR`, assets.animation`IsolMeleeRight`, assets.animation`Lobster`, assets.animation`LobsterIL`, assets.animation`IsolMeleeLeft`)
                ProjTrackII(Attack, x + scene.cameraProperty(CameraProperty.Left), y + scene.cameraProperty(CameraProperty.Top), 175)
                Attack.ax = (x + scene.cameraProperty(CameraProperty.Left) - Attack.x) / Math.sqrt((x + scene.cameraProperty(CameraProperty.Left) - Attack.x) ** 2 + (y + scene.cameraProperty(CameraProperty.Top) - Attack.y) ** 2) * -300
                Attack.ay = (y + scene.cameraProperty(CameraProperty.Top) - Attack.y) / Math.sqrt((x + scene.cameraProperty(CameraProperty.Left) - Attack.x) ** 2 + (y + scene.cameraProperty(CameraProperty.Top) - Attack.y) ** 2) * -300
            } else if (sprites.readDataNumber(mySprite, "Weapon") == 13) {
                Atk(true, true, image.create(80, 48), true, 15, 15, 800, 800, true, 0, 0, x, y, assets.animation`SickleR`, assets.animation`SickleIR`, assets.animation`IsolMeleeRight`, assets.animation`SickleL`, assets.animation`SickleIL`, assets.animation`IsolMeleeLeft`)
                timer.after(400, function () {
                    sprites.setDataBoolean(Attack, "Fatal?", true)
                })
            } else if (sprites.readDataNumber(mySprite, "Weapon") == 14) {
                Atk(true, true, image.create(112, 80), true, 35, 50, 800, 1400, true, 0, 0, x, y, assets.animation`ClaymoreR`, assets.animation`ClaymoreIR`, assets.animation`IsolMelee3Right`, assets.animation`ClaymoreL`, assets.animation`ClaymoreIL`, assets.animation`IsolMelee3Left`)
            } else if (sprites.readDataNumber(mySprite, "Weapon") == 15) {
                Atk(true, false, image.create(8, 12), true, 12, 16, 1512, 512, false, 0, 0, x, y, assets.animation`Flag`, assets.animation`FlagIR`, assets.animation`IsolMelee2Right`, assets.animation`Flag`, assets.animation`FlagIL`, assets.animation`IsolMelee2Left`)
                Attack.follow(Cursor, 100)
                timer.after(500, function () {
                    Attack.follow(Cursor, 0)
                    ProjTrackII(Attack, Cursor.x, Cursor.y, 100)
                })
            } else if (sprites.readDataNumber(mySprite, "Weapon") == 16) {
                Atk(true, false, image.create(7, 3), false, 50, 65, 20000, 1000, false, 0, 3, x, y, assets.animation`Mine`, assets.animation`MineIR`, assets.animation`IsolMelee2Right`, assets.animation`Mine`, assets.animation`MineIL`, assets.animation`IsolMelee2Left`)
                ProjTrackII(Attack, x + scene.cameraProperty(CameraProperty.Left), y + scene.cameraProperty(CameraProperty.Top), 125)
                Attack.ay = 400
                Attack.fx = 300
                timer.after(900, function () {
                    sprites.setDataBoolean(Attack, "Fatal?", true)
                })
            } else {
            	
            }
        }
    }
})
scene.onHitWall(SpriteKind.Projectile, function (sprite, location) {
    if (!(image.getDimension(sprite.image, image.Dimension.Width) == 7 && image.getDimension(sprite.image, image.Dimension.Height) == 3)) {
        sprites.destroy(sprite)
    }
})
browserEvents.E.onEvent(browserEvents.KeyEvent.Pressed, function () {
    if (sprites.readDataNumber(mySprite, "Weapon") == sprites.readDataNumber(mySprite, "WeaponASlot")) {
        sprites.setDataNumber(mySprite, "Weapon", sprites.readDataNumber(mySprite, "WeaponBSlot"))
    } else if (sprites.readDataNumber(mySprite, "Weapon") == sprites.readDataNumber(mySprite, "WeaponBSlot")) {
        sprites.setDataNumber(mySprite, "Weapon", sprites.readDataNumber(mySprite, "WeaponASlot"))
    }
    WeaponHoldImgs([
    assets.image`Weapon1`,
    assets.image`Weapon2`,
    assets.image`Weapon3`,
    assets.image`Weapon4`,
    assets.image`Weapon5`,
    assets.image`Weapon6`,
    assets.image`Weapon7`,
    assets.image`Weapon8`,
    assets.image`Weapon9`,
    assets.image`Weapon10`,
    assets.image`Weapon11`,
    assets.image`Weapon12`,
    assets.image`Weapon13`,
    assets.image`Weapon14`,
    assets.image`Weapon15`,
    assets.image`Weapon16`
    ], "Weapon", Weapon, mySprite)
})
function Overview (Alive: boolean) {
    ListStorage[0] = 1
    mySprite.setFlag(SpriteFlag.Invisible, true)
    Weapon.setFlag(SpriteFlag.Invisible, true)
    mySprite.ay = 0
    mySprite.vy = 0
    tiles.placeOnTile(mySprite, tiles.getTileLocation(0, 0))
    tiles.placeOnTile(CameraSpr, tiles.getTileLocation(0, 0))
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Deth)
    sprites.destroyAllSpritesOfKind(SpriteKind.Drop)
    sprites.destroyAllSpritesOfKind(SpriteKind.Decor)
    tiles.setCurrentTilemap(tilemap`Epilogue`)
    Epilogue = sprites.create(assets.image`Border`, SpriteKind.Decor)
    Epilogue.z = 1
    if (ListStorage[1] == 1) {
        Epilogue = sprites.create(assets.image`Spire1`, SpriteKind.Decor)
    } else if (ListStorage[1] == 2) {
        Epilogue = sprites.create(assets.image`Spire2`, SpriteKind.Decor)
    } else if (ListStorage[1] == 3) {
        Epilogue = sprites.create(assets.image`Spire3`, SpriteKind.Decor)
    } else {
        Epilogue = sprites.create(assets.image`Spire4`, SpriteKind.Decor)
    }
    Epilogue.setFlag(SpriteFlag.GhostThroughWalls, true)
    Module = sprites.create(assets.image`Module`, SpriteKind.Decor)
    color.startFadeFromCurrent(color.originalPalette, 200)
    timer.after(500, function () {
        if (Alive) {
            textSprite = textsprite.create("Floor " + convertToText(ListStorage[1]) + " Complete", 0, 1)
        } else {
            textSprite = textsprite.create("Death on Floor " + convertToText(ListStorage[1]), 0, 2)
        }
        textSprite.setKind(SpriteKind.Decor)
        textSprite.setPosition(80, 10)
        textSprite = textsprite.create("Sector " + convertToText(ListStorage[2]), 0, 14)
        textSprite.setKind(SpriteKind.Decor)
        textSprite.setPosition(80, 20)
        if (Alive) {
            animation.runImageAnimation(
            Module,
            assets.animation`ModCheck`,
            70,
            false
            )
        } else {
            animation.runImageAnimation(
            Module,
            assets.animation`ModDeath`,
            70,
            false
            )
        }
        Texter(assets.image`ChestIcon`, 3, 10, 40, true)
        Texter(assets.image`SkullIcon`, 4, 10, 60, true)
        Texter(assets.image`ClockIcon`, 5, 150, 40, false)
        Texter(assets.image`TargetIcon`, 6, 150, 60, false)
    })
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (sprites.readDataBoolean(sprite, "Fatal?")) {
        if (sprites.readDataBoolean(mySprite, "Melee?")) {
            sprites.setDataBoolean(sprite, "Fatal?", false)
        } else {
            sprites.destroy(sprite)
        }
        if (sprite.x - otherSprite.x < 0) {
            otherSprite.setVelocity(sprites.readDataNumber(sprite, "Knockback") / (sprites.readDataNumber(otherSprite, "KBResistence") / 50), sprites.readDataNumber(sprite, "Knockback") / (sprites.readDataNumber(otherSprite, "KBResistence") / -100))
        } else {
            otherSprite.setVelocity(sprites.readDataNumber(sprite, "Knockback") / (sprites.readDataNumber(otherSprite, "KBResistence") / -50), sprites.readDataNumber(sprite, "Knockback") / (sprites.readDataNumber(otherSprite, "KBResistence") / -100))
        }
        otherSprite.startEffect(effects.ashes, 200)
        sprites.setDataBoolean(otherSprite, "Alert?", true)
        sprites.changeDataNumberBy(otherSprite, "HP", sprites.readDataNumber(sprite, "Damage") * -1)
        ListStorage[7] = ListStorage[7] + 1
        if (sprites.readDataNumber(otherSprite, "HP") <= 0) {
            sprites.destroy(otherSprite)
            ListStorage[4] = ListStorage[4] + 1
            if (sprites.readDataBoolean(otherSprite, "Mark")) {
                ListStorage[8] = ListStorage[8] - 1
                if (ListStorage[8] == 0) {
                    for (let value of tiles.getTilesByType(assets.tile`BackBrick12`)) {
                        tiles.setTileAt(value, assets.tile`BackBrick10`)
                        tiles.setWallAt(value, false)
                    }
                }
            }
        }
    }
})
function EnemySpawn () {
    Summoner(1, assets.tile`BackBrick6`, assets.tile`BackBrick1`)
    Summoner(2, assets.tile`myTile2`, assets.tile`BackBrick1`)
    Summoner(3, assets.tile`BackBrick9`, assets.tile`BackBrick1`)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (!(sprites.readDataBoolean(mySprite, "Invincible?")) && sprites.readDataBoolean(otherSprite, "Fatal?")) {
        sprites.setDataBoolean(mySprite, "Invincible?", true)
        sprites.changeDataNumberBy(mySprite, "HP", sprites.readDataNumber(otherSprite, "Damage") * -1)
        sprites.setDataBoolean(mySprite, "CanMove?", false)
        if (otherSprite.x - mySprite.x < 0) {
            mySprite.setVelocity(50, -150)
        } else {
            mySprite.setVelocity(-50, -150)
        }
        if (sprites.readDataNumber(mySprite, "HP") <= 0) {
            if (Math.percentChance(98)) {
                Death("Enemy")
            } else {
                Death("EnemyB")
            }
        } else {
            timer.after(500, function () {
                sprites.setDataBoolean(mySprite, "CanMove?", true)
                timer.after(250, function () {
                    sprites.setDataBoolean(mySprite, "Invincible?", false)
                })
            })
        }
    }
})
let DroppedItem: Sprite = null
let textSprite: TextSprite = null
let Module: Sprite = null
let Epilogue: Sprite = null
let Flood: Sprite = null
let Decoration: Sprite = null
let Enemy1: Sprite = null
let Attack: Sprite = null
let ListMod: number[] = []
let ListStorage: number[] = []
let Weapon: Sprite = null
let Cursor: Sprite = null
let CameraSpr: Sprite = null
let mySprite: Sprite = null
THETA()
tiles.setCurrentTilemap(tilemap`TowerA1`)
let Semisol = sprites.create(assets.image`IsolGround`, SpriteKind.Decor)
Semisol.setFlag(SpriteFlag.Invisible, true)
Semisol.setFlag(SpriteFlag.GhostThroughWalls, true)
mySprite = sprites.create(assets.image`Isol`, SpriteKind.Player)
XChamberNum()
controller.player2.moveSprite(mySprite, 1000, 1000)
sprites.setDataBoolean(mySprite, "Mark", false)
sprites.setDataBoolean(mySprite, "CanDash?", true)
sprites.setDataBoolean(mySprite, "Reloaded?", true)
mySprite.ay = 500
mySprite.z = 1
sprites.setDataString(mySprite, "State", "Idle")
sprites.setDataNumber(mySprite, "HP", 100)
sprites.setDataNumber(mySprite, "WeaponASlot", 1)
sprites.setDataNumber(mySprite, "WeaponBSlot", 2)
sprites.setDataNumber(mySprite, "Weapon", sprites.readDataNumber(mySprite, "WeaponASlot"))
CameraSpr = sprites.create(assets.image`Camma`, SpriteKind.Camman)
tiles.placeOnTile(CameraSpr, tiles.getTileLocation(9, 4))
scene.cameraFollowSprite(CameraSpr)
CameraSpr.setFlag(SpriteFlag.GhostThroughWalls, true)
CameraSpr.setFlag(SpriteFlag.Invisible, true)
Cursor = sprites.create(assets.image`Curser`, SpriteKind.Curso)
Cursor.setFlag(SpriteFlag.Ghost, true)
Cursor.setFlag(SpriteFlag.Invisible, true)
scroller.setLayerImage(scroller.BackgroundLayer.Layer1, assets.image`Back1`)
scroller.scrollBackgroundWithSpeed(-10, 80, scroller.BackgroundLayer.Layer1)
scroller.setLayerImage(scroller.BackgroundLayer.Layer4, assets.image`HP`)
scroller.setLayerZIndex(scroller.BackgroundLayer.Layer4, 1000)
// Bananarang
// Nuke
// Molotov
// Shureichen
// Glass of Juice
// Sledgehammer
Weapon = sprites.create(assets.image`Weapon1`, SpriteKind.Food)
Weapon.z = 2
Weapon.setFlag(SpriteFlag.Ghost, true)
WeaponHoldImgs([
assets.image`Weapon1`,
assets.image`Weapon2`,
assets.image`Weapon3`,
assets.image`Weapon4`,
assets.image`Weapon5`,
assets.image`Weapon6`,
assets.image`Weapon7`,
assets.image`Weapon8`,
assets.image`Weapon9`,
assets.image`Weapon10`,
assets.image`Weapon11`,
assets.image`Weapon12`,
assets.image`Weapon13`,
assets.image`Weapon14`,
assets.image`Weapon15`,
assets.image`Weapon16`
], "Weapon", Weapon, mySprite)
// 0: Intermission?
// 1: Floor
// 2: Sector
// 3: ChestsLooted
// 4: EnemiesKilled
// 5: Time
// 6: Accuracy[P]
// 7: Accuracy[H]
// 8: EnemiesLeft
// 9: StoredRando
// 10: Simplif
ListStorage = [
0,
1,
1,
0,
0,
0,
0,
0,
0,
1,
0
]
EnemySpawn()
ListMod = [
0,
0,
0,
0,
-13
]
for (let index = 0; index <= ListMod.length - 2; index++) {
    while (ListMod[ListMod.length - 1] == -13) {
        ListStorage[9] = randint(2, 7)
        for (let value of ListMod) {
            if (ListStorage[9] == value) {
                break;
            }
            if (value == -13) {
                ListMod[index] = ListStorage[9]
                ListMod[ListMod.length - 1] = -12
            }
        }
    }
    ListMod[ListMod.length - 1] = -13
}
ListMod[ListMod.length - 1] = randint(-3, -1)
ListMod[0] = randint(-3, -1)
game.onUpdateInterval(1000, function () {
    if (ListStorage[0] == 0) {
        ListStorage[5] = ListStorage[5] + 1
    }
})
forever(function () {
    if (mySprite.vy >= 0 && (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor0`) || mySprite.tileKindAt(TileDirection.Bottom, assets.tile`BackBrick5`))) {
        mySprite.vy = 0
        mySprite.y = mySprite.tilemapLocation().y
    }
})
forever(function () {
    if (controller.up.isPressed() && (mySprite.isHittingTile(CollisionDirection.Bottom) || (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor0`) || mySprite.tileKindAt(TileDirection.Bottom, assets.tile`BackBrick5`))) && sprites.readDataBoolean(mySprite, "CanMove?")) {
        if (sprites.readDataNumber(mySprite, "FacingLeft?") == 0) {
            animation.runImageAnimation(
            mySprite,
            assets.animation`IsolJumpRight`,
            200,
            true
            )
        } else {
            animation.runImageAnimation(
            mySprite,
            assets.animation`IsolJumpLeft`,
            200,
            true
            )
        }
        sprites.setDataString(mySprite, "State", "Jump")
        mySprite.vy = -225
        timer.after(100, function () {
            if (!(controller.up.isPressed())) {
                mySprite.vy = -50
            } else {
                timer.after(50, function () {
                    if (!(controller.up.isPressed())) {
                        mySprite.vy = -50
                    }
                })
            }
        })
        pauseUntil(() => !(controller.up.isPressed()))
    }
})
forever(function () {
    CameraSpr.follow(mySprite, (Math.abs(mySprite.x - scene.cameraProperty(CameraProperty.X)) + Math.abs(mySprite.y - scene.cameraProperty(CameraProperty.Y))) * 2 + 20)
    Weapon.setPosition(mySprite.x, mySprite.y)
    Semisol.setPosition(mySprite.x, mySprite.y + 11)
    Cursor.setPosition(sprites.readDataNumber(Cursor, "X") + scene.cameraProperty(CameraProperty.Left), sprites.readDataNumber(Cursor, "Y") + scene.cameraProperty(CameraProperty.Top))
    Flood.x = mySprite.x
    if (ListStorage[0] == 0) {
        scroller.setBackgroundScrollOffset(160 + sprites.readDataNumber(mySprite, "HP") * 1.6, 0, scroller.BackgroundLayer.Layer4)
    } else {
        scroller.setBackgroundScrollOffset(160, 0, scroller.BackgroundLayer.Layer4)
    }
    if (sprites.readDataBoolean(mySprite, "Melee?")) {
        Attack.setPosition(mySprite.x, mySprite.y)
    }
    if (sprites.readDataBoolean(mySprite, "CanMove?")) {
        if (controller.right.isPressed()) {
            if (sprites.readDataString(mySprite, "State") != "WalkRE" && mySprite.vy == 0) {
                sprites.setDataString(mySprite, "State", "WalkR")
                animation.runImageAnimation(
                mySprite,
                assets.animation`IsolWalkRight`,
                100,
                true
                )
                sprites.setDataString(mySprite, "State", "WalkRE")
            }
            if (mySprite.vx < 80) {
                mySprite.vx += 10
            }
        } else if (controller.left.isPressed()) {
            if (sprites.readDataString(mySprite, "State") != "WalkLE" && mySprite.vy == 0) {
                sprites.setDataString(mySprite, "State", "WalkL")
                animation.runImageAnimation(
                mySprite,
                assets.animation`IsolWalkLeft`,
                100,
                true
                )
                sprites.setDataString(mySprite, "State", "WalkLE")
            }
            if (mySprite.vx > -80) {
                mySprite.vx += -10
            }
        } else {
            if (mySprite.vx < 0) {
                mySprite.vx += 10
            } else if (mySprite.vx > 0) {
                mySprite.vx += -10
            } else {
                if (sprites.readDataString(mySprite, "State") != "IdleE") {
                    sprites.setDataString(mySprite, "State", "Idle")
                }
                if (sprites.readDataString(mySprite, "State") == "Idle" && mySprite.vy == 0) {
                    if (sprites.readDataNumber(mySprite, "FacingLeft?") == 1) {
                        animation.runImageAnimation(
                        mySprite,
                        assets.animation`IsolIdleLeft`,
                        200,
                        true
                        )
                    } else {
                        animation.runImageAnimation(
                        mySprite,
                        assets.animation`IsolIdleRight`,
                        200,
                        true
                        )
                    }
                    sprites.setDataString(mySprite, "State", "IdleE")
                }
            }
        }
    }
})
