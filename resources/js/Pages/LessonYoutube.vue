<?php
<template>
    <AppLayout :title="videoTitle">
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 bg-white border-b border-gray-200">
                        <nav class="mb-4">
                            <ol class="flex text-sm">
                                <li><Link href="/courses" class="text-blue-600 hover:underline">Courses</Link></li>
                                <li class="mx-2">/</li>
                                <li><Link :href="route('courses.youtube', course.slug)" class="text-blue-600 hover:underline">{{ course.name }}</Link></li>
                                <li class="mx-2">/</li>
                                <li class="text-gray-500">{{ videoTitle }}</li>
                            </ol>
                        </nav>

                        <h1 class="text-2xl font-bold mb-4">{{ videoTitle }}</h1>

                        <!-- Video Player -->
                        <div class="aspect-w-16 aspect-h-9 mb-8">
                            <iframe
                                :src="'https://www.youtube.com/embed/' + videoId"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                                class="w-full h-full"
                            ></iframe>
                        </div>

                        <!-- Key Insights -->
                        <div class="mb-8">
                            <h2 class="text-xl font-semibold mb-4">Key Insights</h2>
                            <div v-if="insights && insights.length > 0" class="space-y-4">
                                <ul class="list-disc pl-5 space-y-2">
                                    <li v-for="(insight, index) in insights" :key="index" class="text-gray-700">
                                        {{ insight }}
                                    </li>
                                </ul>
                            </div>
                            <div v-else class="text-gray-500 italic">
                                Loading insights...
                            </div>
                        </div>

                        <!-- Quiz Section -->
                        <div class="mb-8 p-6 bg-gray-50 rounded-lg">
                            <h2 class="text-xl font-semibold mb-4">Knowledge Check</h2>
                            <div v-if="question && question.question" class="space-y-4">
                                <p class="mb-4 text-lg">{{ question.question }}</p>
                                <div class="space-y-2">
                                    <label
                                        v-for="(option, index) in question.options"
                                        :key="index"
                                        class="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                                        :class="{
                                            'bg-green-100': showAnswer && option === question.correct_answer,
                                            'bg-red-100': showAnswer && selectedAnswer === option && option !== question.correct_answer
                                        }"
                                    >
                                        <input
                                            type="radio"
                                            :value="option"
                                            v-model="selectedAnswer"
                                            :disabled="showAnswer"
                                            class="mr-3"
                                            @change="handleAnswerSelection"
                                        >
                                        <span>{{ option }}</span>
                                    </label>
                                </div>
                                <div class="mt-4">
                                    <button
                                        v-if="!showAnswer && selectedAnswer"
                                        @click="checkAnswer"
                                        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                    >
                                        Submit Answer
                                    </button>
                                    <div v-if="showAnswer" class="mt-4 p-4 rounded-lg" :class="answerFeedbackClass">
                                        <p class="font-semibold">{{ answerFeedbackMessage }}</p>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-gray-500 italic">
                                Loading question...
                            </div>
                        </div>

                        <!-- Navigation -->
                        <div class="flex justify-between mt-8">
                            <Link
                                v-if="navigation.previous"
                                :href="route('courses.youtube.lesson', {
                                    course: course.slug,
                                    videoId: navigation.previous
                                })"
                                class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                            >
                                Previous Lesson
                            </Link>
                            <Link
                                v-if="navigation.next"
                                :href="route('courses.youtube.lesson', {
                                    course: course.slug,
                                    videoId: navigation.next
                                })"
                                :class="[
                                    'px-4 py-2 rounded-lg transition',
                                    {
                                        'bg-blue-500 text-white hover:bg-blue-600': isQuestionAnsweredCorrectly,
                                        'bg-gray-300 text-gray-600 cursor-not-allowed': !isQuestionAnsweredCorrectly
                                    }
                                ]"
                                :disabled="!isQuestionAnsweredCorrectly"
                            >
                                Next Lesson
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script>
import { defineComponent } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import { Link } from '@inertiajs/vue3'

export default defineComponent({
    components: {
        AppLayout,
        Link
    },
    props: {
        course: Object,
        videoId: String,
        videoTitle: String,
        insights: {
            type: Array,
            required: true
        },
        question: {
            type: Object,
            required: true
        },
        navigation: Object
    },
    data() {
        return {
            selectedAnswer: null,
            showAnswer: false,
            isQuestionAnsweredCorrectly: false
        }
    },
    computed: {
        answerFeedbackClass() {
            return this.isQuestionAnsweredCorrectly
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
        },
        answerFeedbackMessage() {
            return this.isQuestionAnsweredCorrectly
                ? 'Correct! You can now proceed to the next lesson.'
                : 'Incorrect. Try again!'
        }
    },
    methods: {
        handleAnswerSelection() {
            this.showAnswer = false
            this.isQuestionAnsweredCorrectly = false
        },
        checkAnswer() {
            this.showAnswer = true
            this.isQuestionAnsweredCorrectly = this.selectedAnswer === this.question.correct_answer
        }
    },
    watch: {
        videoId() {
            // Reset quiz state when video changes
            this.selectedAnswer = null
            this.showAnswer = false
            this.isQuestionAnsweredCorrectly = false
        }
    }
})
</script>
