const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.resolveTargetQuery(.{
        .cpu_arch = .wasm32,
        .os_tag = .freestanding,
    });

    // target/optimize now live on the module
    const root_mod = b.createModule(.{
        .root_source_file = b.path("zig/root.zig"),
        .target = target,
        .optimize = .ReleaseFast,
    });

    const wasm = b.addExecutable(.{
        .name = "lib",
        .root_module = root_mod,
    });

    // export pub symbols (like -rdynamic) + no entry (_start)
    wasm.rdynamic = true;
    wasm.entry = .disabled;

    b.installArtifact(wasm);

    const wasm_step = b.step("wasm", "Build the WASM module");
    wasm_step.dependOn(&wasm.step);
}
