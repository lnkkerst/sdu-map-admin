# sdu-map-admin

## Introduction

SDU map admin.

Simple two-dimensional map, using pixel projection.

Development based on [antfu/vitesse](https://github.com/antfu/vitesse).

## Usage

### Development

```bash
pnpm run dev
```

### Build SPA

```bash
pnpm run build
```

### Build SSG(experimental)

```bash
pnpm run build:ssg
```

## TODO

- [ ] Front end
  - [x] Marker info CURD
  - [ ] Image base scale
  - [ ] Multi select
    - [x] Move
    - [ ] Scale
    - [ ] Rotate
  - [ ] Image Cropping
  - [ ] Image filters
  - [ ] Multi map
  - [ ] Auth system
    - [ ] Login
    - [ ] Rules base auto
- [ ] Server Interation
  - [ ] Basic CURD
  - [ ] Diff
