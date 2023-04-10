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
        Schema::create('secretaries', function (Blueprint $table) {
            $table->unsignedInteger('unit_id');
            $table->foreign('unit_id')->references('id')->on('units');
            $table->unsignedInteger('appointment_type_id');
            $table->foreign('appointment_type_id')->references('id')->on('appointment_types');
            $table->primary(['unit_id', 'appointment_type_id']);
            $table->integer('quantity');
            $table->json('days');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('secretaries');
    }
};
