/**
 * The single source of truth for every photograph the site serves.
 *
 * Alt text, base paths and available widths all live here rather than beside
 * each `<ResponsiveImage>`, because the same image is shown in several places
 * (a solution's banner also appears on its card; an automation system appears
 * both in the homepage accordion and in the /what-we-build gallery) and those
 * copies used to be maintained by hand.
 *
 * Widths per image are deliberate, not decorative: `scripts/optimize-*.mjs`
 * only emits the sizes listed here, and asking `<ResponsiveImage>` for a width
 * that was never generated yields a 404 in the srcset.
 */

/** Everything generated from a 1376x768 master (see scripts/lib/media.mjs). */
const PHOTO_WIDTHS = [640, 960, 1200];

/** The Phase 4 renders, generated before the masters were lost. */
const RENDER_WIDTHS = [640, 960, 1280, 1600, 1920];

export interface ImageAsset {
  /** Path prefix without the "-{width}.{ext}" suffix. */
  basePath: string;
  widths: number[];
  alt: string;
}

export type SolutionKey = "hub" | "residential" | "commercial" | "industrial";

export const SOLUTION_MEDIA: Record<SolutionKey, ImageAsset> = {
  hub: {
    basePath: "/media/solutions/hub",
    widths: RENDER_WIDTHS,
    alt: "Delvion Energy installations across a residential home, commercial building and industrial site",
  },
  residential: {
    basePath: "/media/solutions/residential",
    widths: PHOTO_WIDTHS,
    alt: "Rooftop solar array on a Tamil Nadu home, mounted clear of the parapet on galvanised frames, with the inverter and distribution boxes wall-mounted alongside",
  },
  commercial: {
    basePath: "/media/solutions/commercial",
    widths: PHOTO_WIDTHS,
    alt: "Rows of solar panels covering the flat roof of a three-storey commercial building, with cable trays running back to the roof-mounted inverters",
  },
  industrial: {
    basePath: "/media/solutions/industrial",
    widths: RENDER_WIDTHS,
    alt: "Large-scale rooftop solar across a cluster of industrial warehouses, with a ground-mounted array in the adjoining field",
  },
};

export type AutomationCategoryId = "spm" | "conveyors" | "robotic" | "gantry" | "solar";

export interface AutomationCategoryMeta {
  id: AutomationCategoryId;
  /** Short label for the gallery filter chips. */
  label: string;
  /** Full name used as the accordion title on the homepage. */
  name: string;
}

export const AUTOMATION_CATEGORIES: AutomationCategoryMeta[] = [
  { id: "spm", label: "SPM", name: "Special Purpose Machines (SPM)" },
  { id: "conveyors", label: "Conveyors & Handling", name: "Conveyors And Handling Systems" },
  { id: "robotic", label: "Robotic", name: "Robotic Automation" },
  { id: "gantry", label: "Gantry", name: "Gantry Automation" },
  { id: "solar", label: "Solar", name: "Solar Installations" },
];

export interface GalleryItem extends ImageAsset {
  id: string;
  category: AutomationCategoryId;
  title: string;
}

function spm(id: string, title: string, alt: string): GalleryItem {
  return { id, category: "spm", title, alt, basePath: `/media/automation/spm/${id}`, widths: PHOTO_WIDTHS };
}
function conveyor(id: string, title: string, alt: string): GalleryItem {
  return { id, category: "conveyors", title, alt, basePath: `/media/automation/conveyors/${id}`, widths: PHOTO_WIDTHS };
}
function robotic(id: string, title: string, alt: string): GalleryItem {
  return { id, category: "robotic", title, alt, basePath: `/media/automation/robotic/${id}`, widths: PHOTO_WIDTHS };
}
function gantry(id: string, title: string, alt: string): GalleryItem {
  return { id, category: "gantry", title, alt, basePath: `/media/automation/gantry/${id}`, widths: PHOTO_WIDTHS };
}

/**
 * Every equipment photograph we hold, in the order the gallery shows them.
 * The homepage accordion pulls its per-category lead image from the first
 * entry of each category, so reordering a category changes both surfaces.
 */
export const GALLERY_ITEMS: GalleryItem[] = [
  // Special Purpose Machines
  spm(
    "assembly-line-station",
    "Assembly Line & Station",
    "Multi-station assembly line built on an aluminium profile frame, chaining a robot cell, a press station and an indexing table along a blue belt conveyor, with HMI panels at each end",
  ),
  spm(
    "leak-testing-machine",
    "Leak Testing Machine",
    "Enclosed leak testing station holding a cast housing on a tilting fixture, with the pressure regulators, gauges and control cabinet mounted on the right",
  ),
  spm(
    "pressing-machine",
    "Pressing Machine",
    "Guarded hydraulic press with a ram lowering onto a component held in a locating fixture, alongside its control cabinet and HMI",
  ),
  spm(
    "tightening-system",
    "Tightening System",
    "Five servo-driven nutrunner spindles on a gantry beam, tightening a gearbox housing clamped to the fixture plate below",
  ),
  spm(
    "jigs-fixtures",
    "Jigs & Fixtures",
    "Machining and assembly fixture plate holding two gearbox housings on precision clamps, served by a gantry spindle bank and two articulated arms",
  ),
  spm(
    "drill-tap-machine",
    "Drill & Tap Machine",
    "Twin-spindle drilling and tapping head on a gantry, working into a cast housing clamped to the fixture bed inside a guarded cell",
  ),
  spm(
    "zero-gravity-balancer",
    "Zero Gravity Balancer",
    "Zero-gravity balancer arm carrying a gearbox housing on a vacuum end effector, letting one operator position a heavy part onto the fixture plate",
  ),
  spm(
    "auto-part-loader-cnc",
    "Auto Part Loader for CNC Machines",
    "Automatic part loader inside a guarded cell, transferring castings from a stepped feed magazine into the machine fixture with a balancer arm",
  ),

  // Conveyors & Handling
  conveyor(
    "pallet-conveyor",
    "Pallet Conveyor",
    "Motorised pallet conveyor line carrying loaded wooden pallets of castings through a gantry stacking station into a guarded transfer cell",
  ),
  conveyor(
    "slat-conveyor",
    "Slat Conveyor",
    "Curved stainless slat conveyor carrying machined housings around a 180-degree bend, driven by a chain and gear motor at the head end",
  ),
  conveyor(
    "roller-conveyor",
    "Roller Conveyor",
    "Powered roller conveyor loop moving cartons and plastic totes around a curve, with photoelectric sensors and a chain-driven gear motor",
  ),
  conveyor(
    "belt-conveyor",
    "Belt Conveyor",
    "Green-belt conveyor running in a long loop, carrying cast aluminium parts and gear sets past sensor gates to a gear motor at the drive end",
  ),
  conveyor(
    "modular-belt-conveyor",
    "Modular Belt Conveyor",
    "Modular plastic-belt conveyor curving through 180 degrees with green edge guides, carrying valve bodies and gear stacks over a blue gear motor",
  ),
  conveyor(
    "chain-conveyor",
    "Chain Conveyor",
    "Heavy-duty twin-strand chain conveyor in black, carrying engine blocks on carrier plates around a long rectangular loop past a control pillar",
  ),
  conveyor(
    "bucket-elevator",
    "Bucket Elevator",
    "Bucket elevator lifting granular material up an enclosed steel column and discharging it into a hopper, with a feed conveyor and control panel alongside",
  ),
  conveyor(
    "gravity-conveyor",
    "Gravity Conveyor",
    "Unpowered gravity roller conveyor arranged as a T-junction, holding cartons, a tote and machined valve bodies, with an HMI at the merge point",
  ),
  conveyor(
    "trolley-system",
    "Trolley System",
    "Overhead trolley conveyor running on an I-beam track, carrying engine blocks and suspension castings on hooks through the roof structure",
  ),
  conveyor(
    "manipulator",
    "Manipulator",
    "Column-mounted pneumatic manipulator with a vacuum-and-clamp end effector, lowering an engine block onto a locating fixture on a work table",
  ),

  // Robotic Automation
  robotic(
    "cnc-auto-loading-cell",
    "CNC Auto Loading Cell",
    "Robotic machine-tending cell: a six-axis arm on a gantry rail loading an engine block into a vertical machining centre, with staged fixtures alongside",
  ),
  robotic(
    "robotic-palletizing",
    "Robotic Palletizing & Depalletizing",
    "Robot cell palletizing cartons onto a wooden pallet while a gantry unit feeds castings in from a rack, with an outfeed conveyor of stacked boxes",
  ),
  robotic(
    "robotic-deburring-cell",
    "Robotic Deburring Cell",
    "Deburring cell where a six-axis robot presents an engine block to a gantry-mounted spindle head, with extraction ducting and racks of raw castings behind",
  ),
  robotic(
    "eoat",
    "EOAT — End-of-Arm Tooling",
    "Close-up of a custom end-of-arm tool on a six-axis robot: pneumatic clamps and vacuum pads gripping an engine block, with valves and cable carrier on the wrist",
  ),
  robotic(
    "gantry-robots",
    "Gantry Robots",
    "Combined gantry and six-axis robot cell handling an engine block between two fixture tables inside a guarded enclosure",
  ),

  // Gantry Automation
  gantry(
    "cnc-vmc-loading-cell",
    "CNC / VMC Auto Loading Cell",
    "Cartesian gantry spanning two vertical machining centres on the shop floor, its vertical axis carrying a gripper between the two machine tables",
  ),
  gantry(
    "palletizing-depalletizing",
    "Palletizing & Depalletizing",
    "White gantry robot palletizing cartons and stacking plastic totes onto pallets in a bright assembly hall",
  ),
  gantry(
    "dispensing-gluing",
    "Dispensing & Gluing",
    "Gantry-mounted dispensing head applying adhesive to a row of cast housings held on a fixture bench, fed from a metering unit at the column base",
  ),

  // Solar
  {
    id: "residential-rooftop",
    category: "solar",
    title: "Residential Rooftop Installation",
    ...SOLUTION_MEDIA.residential,
  },
  {
    id: "commercial-rooftop",
    category: "solar",
    title: "Commercial Rooftop Installation",
    ...SOLUTION_MEDIA.commercial,
  },
];

/** Gallery items for one category, in catalogue order. */
export function galleryItemsFor(category: AutomationCategoryId): GalleryItem[] {
  return GALLERY_ITEMS.filter((item) => item.category === category);
}
