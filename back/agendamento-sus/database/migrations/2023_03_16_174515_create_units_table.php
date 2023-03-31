<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('rua');
            $table->string('numero');
            $table->string('bairro');
            $table->unsignedInteger('appointment_type_id');
            $table->foreign('appointment_type_id')->references('id')->on('appointment_types');
            $table->datetime('open_time');
            $table->datetime('close_time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
